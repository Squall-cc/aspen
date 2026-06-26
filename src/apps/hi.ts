import { setContent } from "../windowhelpers";

export default function run(id: symbol) {
  const iframe = document.createElement("iframe");
  iframe.src = "https://example.com";
  setContent(id, iframe);
}
