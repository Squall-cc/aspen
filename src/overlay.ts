let ctx: CanvasRenderingContext2D | null = null;

export function setOverlayContext(c: CanvasRenderingContext2D) {
  ctx = c;
}

export function draw(fn: (ctx: CanvasRenderingContext2D) => void) {
  if (ctx) fn(ctx);
}
