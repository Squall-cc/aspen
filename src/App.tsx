import { For, type Component } from 'solid-js';
import Window from './Window';
import Taskbar from './Taskbar';
import { windows, closeWindow } from './windowhelpers';

const App: Component = () => {
  return (
    <>
      <For each={windows()}>
        {(w) => (
          <Window title={w.text} onclose={() => closeWindow(w.id)}>
            <p>{w.text}</p>
          </Window>
        )}
      </For>
      <Taskbar />
    </>
  );
};

export default App;
