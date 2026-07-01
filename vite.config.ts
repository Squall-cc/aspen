import { execSync } from "node:child_process";
import {
  cpSync,
  existsSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";

import devtools from "solid-devtools/vite";
import { defineConfig, type Plugin } from "vite";
import solidPlugin from "vite-plugin-solid";

const browser_repo = "https://github.com/Squall-cc/browser.git";
const pulsar_repo = "https://github.com/abndnce/pulsar.git";
const browser_cache = path.resolve(import.meta.dirname, ".cache/browser");
const pulsar_dir = path.join(browser_cache, "pulsar");

function cloneOrPull(repo: string, dir: string) {
  if (existsSync(dir)) {
    execSync("git pull", { cwd: dir, stdio: "inherit" });
  } else {
    execSync(`git clone --depth 1 ${repo} "${dir}"`, { stdio: "inherit" });
  }
}

function ensureWorkspaces(pkgPath: string, workspaces: string[]) {
  const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
  if (!pkg.workspaces) {
    pkg.workspaces = workspaces;
    writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
  }
}

function browserSubBuildPlugin(): Plugin {
  return {
    name: "browser-sub-build",
    apply: "build",
    closeBundle() {
      cloneOrPull(browser_repo, browser_cache);
      cloneOrPull(pulsar_repo, pulsar_dir);
      ensureWorkspaces(path.join(pulsar_dir, "package.json"), ["packages/*"]);
      // todo, pnpm support or whatever dave uses
      execSync("bun install", { cwd: browser_cache, stdio: "inherit" });
      execSync("bun run build", { cwd: browser_cache, stdio: "inherit" });

      const srcDist = path.join(browser_cache, "dist");
      const destDist = path.resolve(import.meta.dirname, "dist", "browser");

      rmSync(destDist, { recursive: true, force: true });
      cpSync(srcDist, destDist, { recursive: true });
    },
  };
}

export default defineConfig({
  plugins: [devtools(), solidPlugin(), browserSubBuildPlugin()],
  server: {
    port: 3000,
  },
  build: {
    target: "esnext",
  },
});
