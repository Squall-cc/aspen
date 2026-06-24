import { createSignal } from "solid-js";

interface WindowData {
  id: symbol;
  text: string;
}

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol essentially just uncollidable uuid-like
const [windows, setWindows] = createSignal<WindowData[]>([]);

export { windows };
export type { WindowData };
export const spawn = (text: string = "welcome") => setWindows(windows().concat({ id: Symbol(), text }));
export const closeWindow = (id: symbol) => setWindows(windows().filter(w => w.id !== id));
