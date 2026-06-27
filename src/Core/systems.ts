export function setWallpaper(url: string) {
  const el = document.getElementById("wallpaper");
  if (el) el.style.backgroundImage = `url(${url})`;
}
