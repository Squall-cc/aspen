import { For, Show, onMount, type Component } from 'solid-js';
import './App.css';
import Window from './Window';
import Taskbar from './Taskbar';
import { windows, closeWindow, minimize, bringupwards, debug123 } from './windowhelpers';
import { setOverlayContext } from './overlay';
import * as iSApi from "../Apis/iSApi"

const App: Component = () => {

  let overlay!: HTMLCanvasElement;

  onMount(() => {
    overlay.width = window.innerWidth;
    overlay.height = window.innerHeight;
    setOverlayContext(overlay.getContext("2d")!);
  });
  let db = new iSApi.RegistryInstanceAccess()
  if (!db.getKey("InternalSystem/Settings/ctheme").getValue("curbkg").value) {
    db.getKey("InternalSystem/Settings/ctheme").setValue("curbkg", "default0")
  }
  if (db.getKey("InternalSystem/Settings/ctheme").getValue("curbkg").value == "default0") {
    ""
  }
  return (
    <>
      <div id="wallpaper" />
      <canvas id="overlay" ref={overlay} />
      <For each={windows}>
        {(w) => (
          <Show when={!w.minimized}>
            <Window hwnd={w.hwnd} title={w.title} zIndex={w.z} onclose={() => closeWindow(w.hwnd)} onminimize={() => minimize(w.hwnd)} onfocus={() => bringupwards(w.hwnd)}>
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
