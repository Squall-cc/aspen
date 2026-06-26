import { createStore } from "solid-js/store";
import type { JSX } from "solid-js";
import { clearWindowCanvas } from "./overlay";
// todo: debug window dragging resizing bottom right
interface WindowData {
  hwnd: symbol;
  title: string;
  z: number; // z index
  minimized: boolean;
  content?: JSX.Element;
}

let topZ = 9;
export let windowsmap = new Map<symbol, string>([])
let domMap = new Map<symbol, HTMLDivElement>();


// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol essentially just uncollidable uuid-like
const [windows, setWindows] = createStore<WindowData[]>([]);

export { windows };
export type { WindowData };
export function closeWindow(hwnd: symbol) {
  setWindows(windows.filter(w => w.hwnd !== hwnd));
  windowsmap.delete(hwnd);
  domMap.delete(hwnd);
  clearWindowCanvas(hwnd);
}

export function registerWindowElement(hwnd: symbol, el: HTMLDivElement) {
  domMap.set(hwnd, el);
}

export function getDimensions(hwnd: symbol) {
  let el = domMap.get(hwnd);
  if (!el) return undefined;
  return { width: el.offsetWidth, height: el.offsetHeight };
}

export function getDimensionsByUUID(uuid: string) {
  let hwnd = getSymbolByUUID(uuid);
  if (!hwnd) return undefined;
  return getDimensions(hwnd);
}

export function setDimensions(hwnd: symbol, dimensions: { width: number; height: number }) {
  let el = domMap.get(hwnd);
  if (!el) return;
  el.style.width = dimensions.width + "px";
  el.style.height = dimensions.height + "px";
}

export function setDimensionsByUUID(uuid: string, dimensions: { width: number; height: number }) {
  let hwnd = getSymbolByUUID(uuid);
  if (hwnd) setDimensions(hwnd, dimensions);
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