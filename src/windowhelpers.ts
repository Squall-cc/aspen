import { createStore } from "solid-js/store";

interface WindowData {
  id: symbol;
  text: string;
  z: number;
}

let topZ = 9;

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol essentially just uncollidable uuid-like
const [windows, setWindows] = createStore<WindowData[]>([]);

export { windows };
export type { WindowData };
export const spawn = (text: string = "welcome") => setWindows(windows.length, { id: Symbol(), text, z: ++topZ });
export const closeWindow = (id: symbol) => setWindows(windows.filter(w => w.id !== id));
export const bringupwards = (id: symbol) => setWindows(w => w.id === id, "z", ++topZ);
