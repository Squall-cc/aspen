import { drawToWindow } from "../overlay";

export default function run(id: symbol) {
  drawToWindow(id, ctx => {
    ctx.font = "20px sans-serif";
    ctx.fillStyle = "black";
    ctx.fillText("hello", 10, 30);
  });
}
