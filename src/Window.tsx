
import './Window.css';
import type { ParentComponent } from "solid-js";
import { createSignal } from "solid-js";

interface WindowProps {
  title: string;
  onclose?: () => void; // react style names are dumb, all my homies adore html
}


const Window: ParentComponent<WindowProps> = (props) => {

const [offsetX, setoffsetX] = createSignal(0);
const [offsetY, setoffsetY] = createSignal(0);
let windowthingy!: HTMLDivElement; // typescript extension wont stfu


    return <>
        <div id="window" ref={windowthingy}>
        <div 

        onMouseDown={(e)=> {
          setoffsetX(e.clientX - windowthingy.offsetLeft) 
          setoffsetY(e.clientY - windowthingy.offsetTop)
          document.addEventListener("mouseup", up)
          document.addEventListener("mousemove", move)
          //windowthingy.style.left = (e.clientX-offsetX())+"px";
          //windowthingy.style.top = (e.clientY-offsetY())+"px";
        }}


        id="windowheader">{props.title}
        <button onClick={() => props.onclose?.()}> 
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width="12" height="16">
            <path d="M55.1 73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L147.2 256 9.9 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192.5 301.3 329.9 438.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.8 256 375.1 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192.5 210.7 55.1 73.4z" fill="currentColor"/>
          </svg>
        </button>
        </div>
        {props.children}
        </div>
    </>;
    function move(asdasdasdcfsfgsad: MouseEvent) { 
  windowthingy.style.top = (asdasdasdcfsfgsad.clientY-offsetY())+"px";
    windowthingy.style.left = (asdasdasdcfsfgsad.clientX - offsetX()) + "px";

}

function up() {
  document.removeEventListener("mouseup", up);
  document.removeEventListener("mousemove", move);
}
};

export default Window;




