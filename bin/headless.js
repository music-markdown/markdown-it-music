import "jsdom-global/register.js";

import MarkdownIt from "markdown-it";
import MarkdownMusic from "../index.js";
import { createSVGWindow } from "svgdom";
import { registerWindow } from "@svgdotjs/svg.js";

export default function render(src, transpose, theme) {
  const window = createSVGWindow();
  const document = window.document;
  registerWindow(window, document);

  const md = new MarkdownIt({ html: true }).use(MarkdownMusic);
  md.setTranspose(transpose);
  md.setTheme(theme);
  return md.render(src);
}
