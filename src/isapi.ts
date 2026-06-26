//todo: abstract more with classes so hwnd.dimesnsions() is posssible instead of functions
import type { JSX } from "solid-js";
import {
  windows,
  closeWindow,
  minimize,
  bringupwards,
  setContent,
  getDimensions,
  setDimensions,
  getSymbolByUUID,
} from "./windowhelpers";
import { drawToWindow } from "./overlay";

export class WindowHandle {
  constructor(private hwnd: symbol) {}

  static fromUUID(uuid: string): WindowHandle | undefined {
    const hwnd = getSymbolByUUID(uuid);
    return hwnd ? new WindowHandle(hwnd) : undefined;
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

  draw(fn: (ctx: CanvasRenderingContext2D) => void) {
    drawToWindow(this.hwnd, fn);
  }
}
