import { render } from "solid-js/web";
import "solid-devtools";

import App from "./Core/App";
import { WindowHandle } from "./Apis/iSApi";
import * as systems from "./Core/systems";
import * as registryApi from "./Apis/RegistryApi";
import * as fileSystemApi from "./Apis/FileSystemApi";

declare global {
  interface Window {
    __API: {
      WindowHandle: typeof WindowHandle;
      systems: typeof systems;
      registry: typeof registryApi;
      fs: typeof fileSystemApi;
      version: string;
    };
    WindowHandle: typeof WindowHandle;
  }
}

const API = {
  WindowHandle, // hog off windowhandle
  systems,
  registry: registryApi,
  fs: fileSystemApi,
  version: "1.0.0",
};

// make global
window.__API = API;
window.WindowHandle = WindowHandle;

// logging
if (import.meta.env.DEV) {
  console.log("available:", Object.keys(API));
  console.log("WindowHandle:", WindowHandle);
}


const root = document.getElementById("root");

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    "Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?",
  );
}

render(() => <App />, root!);