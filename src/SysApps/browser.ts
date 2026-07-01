import { setContent } from "../Core/windowhelpers";

export default function run(id: symbol) {
  const iframe = document.createElement("iframe");
  iframe.src = "/browser.html";
  iframe.style.width = "100%";
  iframe.style.height = "100%";
  iframe.style.border = "none";
  setContent(id, iframe);
}
