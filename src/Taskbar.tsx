import './Taskbar.css';
import type { Component } from "solid-js";
import { spawn } from './windowhelpers';

const Taskbar: Component = () => {
  return (
    <div id="taskbar">
      <button onClick={() => spawn("hi")}>hi</button>
      <button onClick={() => spawn("hello")}>hello</button>
    </div>
  );
};

export default Taskbar;
