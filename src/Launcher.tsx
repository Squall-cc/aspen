import './Launcher.css';
import type { Component } from "solid-js";
import { For } from "solid-js";
import { spawn } from './windowhelpers';
import hi from './apps/hi';
import hello from './apps/hello';
import draw from './apps/draw';

const apps = new Map([
  ["hi", hi],
  ["hello", hello],
  ["draw", draw],
]);

const Launcher: Component = () => {
  return (
    <div id="launcher">
      <For each={[...apps]}>
        {([key, run]) => <button onClick={() => spawn(key, run)}>{key}</button>}
      </For>
    </div>
  );
};

export default Launcher;
