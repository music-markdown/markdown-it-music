"use strict";

require("jsdom-global")();

const fs = require("fs");
const MarkdownIt = require("markdown-it");
const MarkdownItMusic = require("../index");
const { createSVGWindow } = require("svgdom");
const { registerWindow } = require("@svgdotjs/svg.js");

const HEADER = `<style>
.chart {
  font-family: "Monaco", "Menlo", "Consolas", monospace;
}

.c1 {
  color: darkblue;
}

.c2 {
  color: darkorange;
}

.l1 {
  color: black;
}

.l2 {
  color: darkgreen;
}

.l3 {
  color: darkmagenta;
}

.l4 {
  color: darkred;
}

${fs.readFileSync(`${__dirname}/../renderers/renderer.css`, {
  encoding: "utf-8",
})}
</style>
`;

function render(src, transpose) {
  const window = createSVGWindow();
  const document = window.document;
  registerWindow(window, document);

  const md = new MarkdownIt({ html: true }).use(MarkdownItMusic);
  md.addHeader(HEADER);
  md.setTranspose(transpose);
  return md.render(src);
}

module.exports = render;
