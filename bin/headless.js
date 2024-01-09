import "global-jsdom/register";
import MarkdownIt from "markdown-it";
import MarkdownItMusic from "../index.js";
import { createSVGWindow } from "svgdom";
import { registerWindow } from "@svgdotjs/svg.js";

export function render(src, transpose, theme) {
  const window = createSVGWindow();
  const document = window.document;
  registerWindow(window, document);

  const md = new MarkdownIt({ html: true }).use(MarkdownItMusic);
  md.setTranspose(transpose);
  md.setTheme(theme);
  return md.render(src);
}
