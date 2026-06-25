import './Launcher.css';
import type { Component } from "solid-js";
import { spawn } from './windowhelpers';

const Launcher: Component = () => {
  return (
    <div id="launcher">
      <button onClick={() => spawn("hi")}>hi</button>
      <button onClick={() => spawn("hello")}>hello</button>
    </div>
  );
};

export default Launcher;
