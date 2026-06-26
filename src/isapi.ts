import type { JSX } from "solid-js";
import {
  windows,
  closeWindow,
  minimize,
  bringupwards,
  setContent,
  getDimensions,
  setDimensions,
  getPosition,
  setPosition,
  setCenter,
  getCorners,
  getSymbolByHWnd,
} from "./windowhelpers";
import { drawToWindow } from "./overlay";

export class WindowHandle {
  constructor(private hwnd: symbol) {}

  static fromHWnd(hwnd: string): WindowHandle | undefined {
    const sym = getSymbolByHWnd(hwnd);
    return sym ? new WindowHandle(sym) : undefined;
  }

  close() {
    closeWindow(this.hwnd);
  }

  minimize() {
    minimize(this.hwnd);
  }

  bringupwards() {
    bringupwards(this.hwnd);
  }

  getTitle() {
    return windows.find(w => w.hwnd === this.hwnd)?.title;
  }

  getContent() {
    return windows.find(w => w.hwnd === this.hwnd)?.content;
  }

  setContent(content: JSX.Element) {
    setContent(this.hwnd, content);
  }

  dimensions() {
    return getDimensions(this.hwnd);
  }

  setDimensions(d: { width: number; height: number }) {
    setDimensions(this.hwnd, d);
  }

  position() {
    return getPosition(this.hwnd);
  }

  setPosition(pos: { x: number; y: number }) {
    setPosition(this.hwnd, pos);
  }

  setCenter(center: { x: number; y: number }) {
    setCenter(this.hwnd, center);
  }

  corners() {
    return getCorners(this.hwnd);
  }

  draw(fn: (ctx: CanvasRenderingContext2D) => void) {
    drawToWindow(this.hwnd, fn);
  }
}
