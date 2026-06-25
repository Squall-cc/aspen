
import './Window.css';
import type { ParentComponent } from "solid-js";
import { createSignal, onMount } from "solid-js";

interface WindowProps {
  title: string;
  zIndex: number;
  onclose?: () => void; // react style names are dumb, all my homies adore html
  onminimize?: () => void;
}


const Window: ParentComponent<WindowProps> = (props) => {

const [offsetX, setoffsetX] = createSignal(0);
const [offsetY, setoffsetY] = createSignal(0);
let windowthingy!: HTMLDivElement; // typescript extension wont stfu

let rszisestartX = 0;
let rszisestarty = 0;
let startwidth = 0;
let startheight = 0;

onMount(() => {
  windowthingy.style.left = (window.innerWidth - windowthingy.offsetWidth) / 2 + "px";
  windowthingy.style.top = (window.innerHeight - windowthingy.offsetHeight) / 2 + "px";
});

    return <>
        <div id="window" ref={windowthingy} style={{ "z-index": props.zIndex }}>
        <div 

        onMouseDown={(e)=> {
          setoffsetX(e.clientX - windowthingy.offsetLeft) 
          setoffsetY(e.clientY - windowthingy.offsetTop)
          document.body.style.userSelect = "none"
          document.addEventListener("mouseup", up)
          document.addEventListener("mousemove", move)
          //windowthingy.style.left = (e.clientX-offsetX())+"px";
          //windowthingy.style.top = (e.clientY-offsetY())+"px";
        }}


        id="windowheader">{props.title}
        <div id="windowcontrols">
        <button onClick={() => props.onminimize?.()}>_</button>
        <button onClick={() => props.onclose?.()}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width="12" height="16">
            <path d="M55.1 73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L147.2 256 9.9 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192.5 301.3 329.9 438.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.8 256 375.1 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192.5 210.7 55.1 73.4z" fill="currentColor"/>
          </svg>
        </button>
        </div>
        </div>
        {props.children}
        <div
        id="resizehandle"
        onMouseDown={(e) => {
          rszisestartX = e.clientX;
          rszisestarty = e.clientY;
          startwidth = windowthingy.offsetWidth;
          startheight = windowthingy.offsetHeight;
          document.body.style.userSelect = "none"
          document.addEventListener("mouseup", resizeUp)
          document.addEventListener("mousemove", resize)
        }}
        />
        </div>
    </>;
    function move(asdasdasdcfsfgsad: MouseEvent) {
  const max2 = window.innerWidth - windowthingy.offsetWidth;
  const max1 = window.innerHeight - windowthingy.offsetHeight;
  windowthingy.style.top = Math.min(max1, Math.max(0, asdasdasdcfsfgsad.clientY - offsetY())) + "px";
  windowthingy.style.left = Math.min(max2, Math.max(0, asdasdasdcfsfgsad.clientX - offsetX())) + "px";

}

function up() {
  document.removeEventListener("mouseup", up);
  document.body.style.userSelect = ""
  document.removeEventListener("mousemove", move);
}

function resize(e: MouseEvent) {
  windowthingy.style.width = Math.max(100, startwidth + (e.clientX - rszisestartX)) + "px";
  windowthingy.style.height = Math.max(100, startheight + (e.clientY - rszisestarty)) + "px";
}

function resizeUp() {
  document.removeEventListener("mouseup", resizeUp);
  document.body.style.userSelect = ""
  document.removeEventListener("mousemove", resize);
}
};

export default Window;




