import { For, createSignal, type Component } from 'solid-js';
import Window from './Window';
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol essentially just uncollidable uuid-like 
const App: Component = () => {
  const [windows, setWindows] = createSignal<symbol[]>([Symbol()]);

  const spawn = () => setWindows(windows().concat(Symbol()));
  const closeWindow = (id: symbol) => setWindows(windows().filter(w => w !== id));

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
