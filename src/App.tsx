import { For, type Component } from 'solid-js';
import './App.css';
import Window from './Window';
import Taskbar from './Taskbar';
import { windows, closeWindow } from './windowhelpers';

const App: Component = () => {
  return (
    <>
      <div id="wallpaper" />
      <For each={windows()}>
        {(w) => (
          <Window title={w.text} onclose={() => closeWindow(w.id)}>
            {w.text === "hi" ? <iframe src="https://example.com" /> : <p>{w.text}</p>}
          </Window>
        )}
      </For>
      <Taskbar />
    </>
  );
};

export default App;
