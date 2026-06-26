import { drawToWindow } from "../overlay";

export default function run(id: symbol) {
  drawToWindow(id, ctx => {
    const canvas = ctx.canvas;
    let drawing = false;

    function paint(e: MouseEvent) {
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) * (canvas.width / rect.width);
      const y = (e.clientY - rect.top) * (canvas.height / rect.height);
      ctx.fillStyle = "black";
      ctx.fillRect(x, y, 4, 4);
    }

    canvas.addEventListener("mousedown", e => { drawing = true; paint(e); });
    canvas.addEventListener("mousemove", e => { if (drawing) paint(e); });
    canvas.addEventListener("mouseup", () => { drawing = false; });
    canvas.addEventListener("mouseleave", () => { drawing = false; });
  });
}
