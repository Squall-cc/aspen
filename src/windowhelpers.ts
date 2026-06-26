import { createStore } from "solid-js/store";

interface WindowData {
  id: symbol;
  text: string;
  z: number; // z index
  minimized: boolean;
}

let topZ = 9;
export let windowsmap =  new Map([])


// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol essentially just uncollidable uuid-like
const [windows, setWindows] = createStore<WindowData[]>([]);

export { windows };
export type { WindowData };
export const closeWindow = (id: symbol) => setWindows(windows.filter(w => w.id !== id));
export const bringupwards = (id: symbol) => setWindows(w => w.id === id, { z: ++topZ, minimized: false });
export const minimize = (id: symbol) => setWindows(w => w.id === id, "minimized", true);
export function spawn(text: string = "welcome") {
  var s = Symbol()
  setWindows(windows.length, { id: s, text, z: ++topZ, minimized: false })
  windowsmap.set(s, crypto.randomUUID())
}

export const debug123 = () => setInterval(()=>console.log("windows :" + windows+"; body:" + document.body), 1000)
