import { For, Show, type Component } from 'solid-js';
import './App.css';
import Window from './Window';
import Taskbar from './Taskbar';
import { windows, closeWindow, minimize, debug123 } from './windowhelpers';

const App: Component = () => {
  return (
    <>
      <div id="wallpaper" />
      <For each={windows}>
        {(w) => (
          <Show when={!w.minimized}>
            <Window title={w.text} zIndex={w.z} onclose={() => closeWindow(w.id)} onminimize={() => minimize(w.id)}>
              {w.text === "hi" ? <iframe src="https://example.com" /> : <p>{w.text}</p>}
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
