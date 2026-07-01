import { FileSystemAccess } from "./FileSystemApi";

export function launch(code: string): void {
  (0, eval)(code);
}

export async function launchfromfile(path: string): Promise<void> {
  const fs = new FileSystemAccess();
  const handle = fs.openFile(path);
  const code = await handle.read();
  if (code === undefined) return;
  launch(code);
}
