type FileType = "file" | "dir";

interface FsEntry {
  path: string;
  lookup: string;
  type: "file" | "dir";
  children?: string[];
  size?: number;
  createdAt: number;
  modifiedAt: number;
}

interface FsMetadata {
  entries: Record<string, FsEntry>;
}

const FS_META_KEY = "VFS_METADATA";
const FS_DB_NAME = "VFS_DATA_DB";
const FS_DB_STORE = "files";

function normalizePath(path: string): string {
  if (!path) return "/";
  const parts = path.split("/").filter(Boolean);
  const stack: string[] = [];
  for (const p of parts) {
    if (p === ".") continue;
    if (p === "..") {
      stack.pop();
      continue;
    }
    stack.push(p);
  }
  return "/" + stack.join("/");
}

class MetadataStore {
  private meta: FsMetadata;

  constructor() {
    const raw = localStorage.getItem(FS_META_KEY);
    if (raw) {
      this.meta = JSON.parse(raw);
    } else {
      this.meta = { entries: {} };
      this.meta.entries["/"] = {
        path: "/",
        lookup: "/",
        type: "dir",
        children: [],
        createdAt: Date.now(),
        modifiedAt: Date.now(),
      };
      this.save();
    }
  }

  private save() {
    localStorage.setItem(FS_META_KEY, JSON.stringify(this.meta));
  }

  getEntry(path: string): FsEntry | null {
    path = normalizePath(path);
    return this.meta.entries[path] || null;
  }

  setEntry(entry: FsEntry) {
    entry.path = normalizePath(entry.path);
    this.meta.entries[entry.path] = entry;
    this.save();
  }

  deleteEntry(path: string) {
    path = normalizePath(path);
    delete this.meta.entries[path];
    this.save();
  }

  listChildren(path: string): string[] {
    path = normalizePath(path);
    const e = this.meta.entries[path];
    if (!e || e.type !== "dir") return [];
    return e.children || [];
  }

  addChild(dirPath: string, childPath: string) {
    dirPath = normalizePath(dirPath);
    childPath = normalizePath(childPath);
    const dir = this.meta.entries[dirPath];
    if (!dir || dir.type !== "dir") return;
    dir.children = dir.children || [];
    if (!dir.children.includes(childPath)) {
      dir.children.push(childPath);
      dir.modifiedAt = Date.now();
      this.save();
    }
  }

  removeChild(dirPath: string, childPath: string) {
    dirPath = normalizePath(dirPath);
    childPath = normalizePath(childPath);
    const dir = this.meta.entries[dirPath];
    if (!dir || dir.type !== "dir" || !dir.children) return;
    dir.children = dir.children.filter((c) => c !== childPath);
    dir.modifiedAt = Date.now();
    this.save();
  }

  renamePath(oldPath: string, newPath: string) {
    oldPath = normalizePath(oldPath);
    newPath = normalizePath(newPath);
    const entry = this.meta.entries[oldPath];
    if (!entry) return;

    delete this.meta.entries[oldPath];
    entry.path = newPath;
    this.meta.entries[newPath] = entry;

    const oldParent = normalizePath(
      oldPath.split("/").slice(0, -1).join("/") || "/",
    );
    const newParent = normalizePath(
      newPath.split("/").slice(0, -1).join("/") || "/",
    );
    this.removeChild(oldParent, oldPath);
    this.addChild(newParent, newPath);

    if (entry.type === "dir" && entry.children) {
      const oldPrefix = oldPath === "/" ? "/" : oldPath + "/";
      const newPrefix = newPath === "/" ? "/" : newPath + "/";
      const updatedChildren: string[] = [];
      for (const child of entry.children) {
        const newChildPath = normalizePath(child.replace(oldPrefix, newPrefix));
        const childEntry = this.meta.entries[child];
        if (childEntry) {
          delete this.meta.entries[child];
          childEntry.path = newChildPath;
          this.meta.entries[newChildPath] = childEntry;
          updatedChildren.push(newChildPath);
        }
      }
      entry.children = updatedChildren;
    }

    this.save();
  }
}

class DataStore {
  private db: IDBDatabase | null = null;
  private ready: Promise<void>;

  constructor() {
    this.ready = new Promise((resolve, reject) => {
      const req = indexedDB.open(FS_DB_NAME, 1);
      req.onupgradeneeded = (e) => {
        const db = (e.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(FS_DB_STORE)) {
          db.createObjectStore(FS_DB_STORE, { keyPath: "path" });
        }
      };
      req.onsuccess = (e) => {
        this.db = (e.target as IDBOpenDBRequest).result;
        resolve();
      };
      req.onerror = (e) => reject(e);
    });
  }

  async write(path: string, data: Blob | string): Promise<void> {
    await this.ready;
    const tx = this.db!.transaction(FS_DB_STORE, "readwrite");
    const store = tx.objectStore(FS_DB_STORE);
    const blob = typeof data === "string" ? new Blob([data]) : data;
    store.put({ path: normalizePath(path), data: blob });
  }

  async read(path: string): Promise<Blob | null> {
    await this.ready;
    return new Promise((resolve) => {
      const tx = this.db!.transaction(FS_DB_STORE, "readonly");
      const store = tx.objectStore(FS_DB_STORE);
      const req = store.get(normalizePath(path));
      req.onsuccess = () => {
        const res = req.result;
        resolve(res ? (res.data as Blob) : null);
      };
      req.onerror = () => resolve(null);
    });
  }

  async delete(path: string): Promise<void> {
    await this.ready;
    const tx = this.db!.transaction(FS_DB_STORE, "readwrite");
    tx.objectStore(FS_DB_STORE).delete(normalizePath(path));
  }

  async rename(oldPath: string, newPath: string): Promise<void> {
    await this.ready;
    const blob = await this.read(oldPath);
    if (!blob) return;
    await this.write(newPath, blob);
    await this.delete(oldPath);
  }
}

export class FileHandle {
  constructor(
    private fs: FileSystemAccess,
    public path: string,
  ) {
    this.path = normalizePath(path);
  }

  async read(): Promise<string | undefined> {
    const blob = await this.fs.data.read(this.path);
    if (!blob) return undefined;
    return blob.text();
  }

  write(data: string | Blob): void {
    (async () => {
      await this.fs.data.write(this.path, data);
      this.fs.updateFileMeta(this.path, data);
    })();
  }

  append(data: string | Blob): void {
    (async () => {
      const existing = await this.fs.data.read(this.path);
      let newBlob: Blob;
      if (!existing) {
        newBlob = typeof data === "string" ? new Blob([data]) : data;
      } else {
        const extra = typeof data === "string" ? new Blob([data]) : data;
        newBlob = new Blob([existing, extra]);
      }
      await this.fs.data.write(this.path, newBlob);
      this.fs.updateFileMeta(this.path, newBlob);
    })();
  }

  delete(): void {
    this.fs.deleteFile(this.path);
  }
}

export class DirectoryHandle {
  constructor(
    private fs: FileSystemAccess,
    public path: string,
  ) {
    this.path = normalizePath(path);
  }

  list(): string[] {
    return this.fs.meta.listChildren(this.path);
  }

  createFile(name: string): FileHandle {
    const full = normalizePath(this.path + "/" + name);
    this.fs.createFile(full);
    return new FileHandle(this.fs, full);
  }

  createDirectory(name: string): DirectoryHandle {
    const full = normalizePath(this.path + "/" + name);
    this.fs.createDirectory(full);
    return new DirectoryHandle(this.fs, full);
  }

  delete(): void {
    this.fs.deleteDirectory(this.path);
  }
}

export class FileSystemAccess {
  public meta: MetadataStore;
  public data: DataStore;

  constructor() {
    this.meta = new MetadataStore();
    this.data = new DataStore();
  }

  exists(path: string): boolean {
    const lookup = this.normalizeLookup(path);
    return this.meta.getEntry(lookup) !== null;
  }

  isFile(path: string): boolean {
    const e = this.meta.getEntry(path);
    return !!e && e.type === "file";
  }

  isDirectory(path: string): boolean {
    const e = this.meta.getEntry(path);
    return !!e && e.type === "dir";
  }

  private normalizeLookup(path: string): string {
    return path.toLowerCase();
  }

  createDirectory(path: string): void {
    const lookup = this.normalizeLookup(path);

    if (this.exists(lookup)) return;

    const parent = this.normalizeLookup(
      path.split("/").slice(0, -1).join("/") || "/",
    );

    const entry: FsEntry = {
      path,
      lookup,
      type: "dir",
      children: [],
      createdAt: Date.now(),
      modifiedAt: Date.now(),
    };

    this.meta.setEntry(entry);
    this.meta.addChild(parent, lookup);
  }

  deleteDirectory(path: string): void {
    path = normalizePath(path);
    const entry = this.meta.getEntry(path);
    if (!entry || entry.type !== "dir") return;

    const children = this.meta.listChildren(path);
    if (children.length > 0) return;

    const parent = normalizePath(path.split("/").slice(0, -1).join("/") || "/");
    this.meta.removeChild(parent, path);
    this.meta.deleteEntry(path);
  }

  listDirectory(path: string): string[] {
    const lookup = this.normalizeLookup(path);
    return this.meta.listChildren(lookup).map((childLookup) => {
      const entry = this.meta.getEntry(childLookup);
      return entry?.path ?? childLookup;
    });
  }

  createFile(path: string): void {
    const original = normalizePath(path);
    const lookup = path.toLowerCase();

    if (this.exists(lookup)) return;

    const parentPath = path.split("/").slice(0, -1).join("/") || "/";
    const parentLookup = parentPath.toLowerCase();

    const now = Date.now();

    const entry: FsEntry = {
      path: original,
      lookup,
      type: "file",
      size: 0,
      createdAt: now,
      modifiedAt: now,
    };

    this.meta.setEntry(entry);

    this.meta.addChild(parentLookup, lookup);

    (async () => {
      await this.data.write(original, new Blob([]));
    })();
  }

  deleteFile(path: string): void {
    path = normalizePath(path);
    const entry = this.meta.getEntry(path);
    if (!entry || entry.type !== "file") return;

    const parent = normalizePath(path.split("/").slice(0, -1).join("/") || "/");
    this.meta.removeChild(parent, path);
    this.meta.deleteEntry(path);
    (async () => {
      await this.data.delete(path);
    })();
  }

  openFile(path: string): FileHandle {
    path = normalizePath(path);
    if (!this.exists(path)) {
      this.createFile(path);
    }
    return new FileHandle(this, path);
  }

  updateFileMeta(path: string, data: Blob | string): void {
    path = normalizePath(path);
    const entry = this.meta.getEntry(path);
    if (!entry || entry.type !== "file") return;
    const size =
      typeof data === "string" ? new Blob([data]).size : (data as Blob).size;
    entry.size = size;
    entry.modifiedAt = Date.now();
    this.meta.setEntry(entry);
  }

  rename(oldPath: string, newPath: string): void {
    oldPath = normalizePath(oldPath);
    newPath = normalizePath(newPath);
    const entry = this.meta.getEntry(oldPath);
    if (!entry) return;

    this.meta.renamePath(oldPath, newPath);
    if (entry.type === "file") {
      (async () => {
        await this.data.rename(oldPath, newPath);
      })();
    }
  }
}
