import { createSignal } from "solid-js";

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol essentially just uncollidable uuid-like
const [windows, setWindows] = createSignal<symbol[]>([]);

export { windows };
export const spawn = () => setWindows(windows().concat(Symbol()));
export const closeWindow = (id: symbol) => setWindows(windows().filter(w => w !== id));
