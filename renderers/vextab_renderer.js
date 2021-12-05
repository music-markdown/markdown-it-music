import vextab from "vextab/releases/vextab-div.js";
const { Artist, Flow, VexTab } = vextab;
const MARGIN_LEFT = 6;
const MARGIN_RIGHT = 2;

// Disable the VexFlow logo
Artist.NOLOGO = true;

function renderVextab(str, opts) {
  // Parse the VexTab music notation
  const artist = new Artist(MARGIN_LEFT, 0, opts.maxWidth - MARGIN_RIGHT);
  const vextab = new VexTab(artist);
  vextab.parse(str);

  // Render notation to VexFlow canvas
  const div = document.createElement("div");
  const renderer = new Flow.Renderer(div, Flow.Renderer.Backends.SVG);
  artist.render(renderer);

  return div.outerHTML;
}

export const plugin = {
  lang: "vextab",
  callback: renderVextab,
};
