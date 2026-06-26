import { createStore } from "solid-js/store";
import type { JSX } from "solid-js";
import { clearWindowCanvas } from "./overlay";

interface WindowData {
  id: symbol;
  text: string;
  z: number; // z index
  minimized: boolean;
  content?: JSX.Element;
}

let topZ = 9; 
export let windowsmap = new Map<symbol, string>([])


// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol essentially just uncollidable uuid-like
const [windows, setWindows] = createStore<WindowData[]>([]);

export { windows };
export type { WindowData };
export function closeWindow(id: symbol) {
  setWindows(windows.filter(w => w.id !== id));
  windowsmap.delete(id);
  clearWindowCanvas(id);
}
export const bringupwards = (id: symbol) => setWindows(w => w.id === id, { z: ++topZ, minimized: false });
export const minimize = (id: symbol) => setWindows(w => w.id === id, "minimized", true);
export function spawn(text: string = "window", run?: (id: symbol) => void) { // text is title btw
  var s = Symbol()
  setWindows(windows.length, { id: s, text, z: ++topZ, minimized: false })
  windowsmap.set(s, crypto.randomUUID())
  run?.(s)
}

export const debug123 = () => setInterval(()=>console.log("windows :" + windows+"; body:" + document.body), 1000)

export function getSymbolByUUID(x: string) {
  let s = [...windowsmap]
  let y = s.find(([, u]) => u === x)
  return y?.[0];
}

export function getTitleByUUID(x: string) {
  let id = getSymbolByUUID(x);
  if (!id) return undefined;
  return windows.find(w => w.id === id)?.text;
}

export function setContent(id: symbol, content: JSX.Element) {
  setWindows(w => w.id === id, "content", content);
}

export function setContentByUUID(uuid: string, content: JSX.Element) {
  let id = getSymbolByUUID(uuid);
  if (id) setContent(id, content);
}

export function getContentByUUID(uuid: string) {
  let id = getSymbolByUUID(uuid);
  if (!id) return undefined;
  return windows.find(w => w.id === id)?.content;
}
