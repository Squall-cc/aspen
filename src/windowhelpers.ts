import { createStore } from "solid-js/store";
import type { JSX } from "solid-js";
import { clearWindowCanvas } from "./overlay";

interface WindowData {
  hwnd: symbol;
  title: string;
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
export function closeWindow(hwnd: symbol) {
  setWindows(windows.filter(w => w.hwnd !== hwnd));
  windowsmap.delete(hwnd);
  clearWindowCanvas(hwnd);
}
export const bringupwards = (hwnd: symbol) => setWindows(w => w.hwnd === hwnd, { z: ++topZ, minimized: false });
export const minimize = (hwnd: symbol) => setWindows(w => w.hwnd === hwnd, "minimized", true);
export function spawn(title: string = "window", run?: (hwnd: symbol) => void) {
  var s = Symbol()
  setWindows(windows.length, { hwnd: s, title: title, z: ++topZ, minimized: false })
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
  let hwnd = getSymbolByUUID(x);
  if (!hwnd) return undefined;
  return windows.find(w => w.hwnd === hwnd)?.title;
}

export function setContent(hwnd: symbol, content: JSX.Element) {
  setWindows(w => w.hwnd === hwnd, "content", content);
}

export function setContentByUUID(uuid: string, content: JSX.Element) {
  let hwnd = getSymbolByUUID(uuid);
  if (hwnd) setContent(hwnd, content);
}

export function getContentByUUID(uuid: string) {
  let hwnd = getSymbolByUUID(uuid);
  if (!hwnd) return undefined;
  return windows.find(w => w.hwnd === hwnd)?.content;
}
