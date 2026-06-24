import { For, type Component } from 'solid-js';
import Window from './Window';
import { windows, spawn, closeWindow } from './windowStore';

const App: Component = () => {
  return (
    <>
      <button onClick={spawn}>spawn</button>
      <For each={windows()}>
        {(id) => <Window title="welcome" onclose={() => { closeWindow(id); alert("closed"); }}/>}
      </For>
    </>
  );
};

export default App;
