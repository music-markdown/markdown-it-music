"use strict";

require("jsdom-global")();

const MarkdownIt = require("markdown-it");
const MarkdownItMusic = require("../index");
const { createSVGWindow } = require("svgdom");
const { registerWindow } = require("@svgdotjs/svg.js");

function render(src, transpose, theme) {
  const window = createSVGWindow();
  const document = window.document;
  registerWindow(window, document);

  const md = new MarkdownIt({ html: true }).use(MarkdownItMusic);
  md.setTranspose(transpose);
  md.setTheme(theme);
  return md.render(src);
}

module.exports = render;
