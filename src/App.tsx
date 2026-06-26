import { For, Show, onMount, type Component } from 'solid-js';
import './App.css';
import Window from './Window';
import Taskbar from './Taskbar';
import { windows, closeWindow, minimize, bringupwards, debug123 } from './windowhelpers';
import { setOverlayContext } from './overlay';

const App: Component = () => {
  let overlay!: HTMLCanvasElement;

  onMount(() => {
    overlay.width = window.innerWidth;
    overlay.height = window.innerHeight;
    setOverlayContext(overlay.getContext("2d")!);
  });

  return (
    <>
      <div id="wallpaper" />
      <canvas id="overlay" ref={overlay} />
      <For each={windows}>
        {(w) => (
          <Show when={!w.minimized}>
            <Window title={w.title} zIndex={w.z} onclose={() => closeWindow(w.hwnd)} onminimize={() => minimize(w.hwnd)} onfocus={() => bringupwards(w.hwnd)}>
              {w.content}
            </Window>
          </Show>
        )}
      </For>
      <Taskbar />
    </>
  );
};
debug123();
export default App;
