import * as abc from "abcjs";

const MARGIN_RIGHT = 2;

function renderAbc(str, opts) {
  const div = document.createElement("div");
  div.className = "abc";
  abc.default.renderAbc(div, str, {
    visualTranspose: opts.transpose,
    staffwidth: opts.maxWidth - MARGIN_RIGHT,
    paddingtop: 0,
    paddingbottom: 0,
    paddingright: 0,
    paddingleft: 0,
    wrap: { minSpacing: 1.8, maxSpacing: 2.7 },
  });
  return div.outerHTML;
}

export const lang = "abc";
export const callback = renderAbc;
