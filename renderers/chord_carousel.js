"use strict";

const chordDiagram = require("./chord_diagram.js");
const { guitarChordbook } = require("../lib/chordbook.js");

function diagramDiv(voicing) {
  const svg = chordDiagram.renderChordDiagram(voicing);
  return `<div class="diagram">${svg}</div>`;
}

function chordCarousel(chord) {
  const attrValue = chord.toAttributeValue();
  const id = `chord-${attrValue}`;

  const voicings = guitarChordbook.get(chord.toString());

  const carousel =
    `<div class="carousel">` +
    `<div><button class="scroll" onclick="toggleSlide('${id}', -1);">❮</button></div>` +
    `<div id="${id}" class="diagrams">` +
    voicings.map(diagramDiv).join("") +
    `</div>` +
    `<div><button class="scroll" onclick="toggleSlide('${id}', 1);">❯</button></div>` +
    `</div>`;

  return (
    `<div id="tooltip-${attrValue}" class="tooltip"` +
    ` onmouseover="cancelHidePopper('${attrValue}')"` +
    ` onmouseout="hidePopper('${attrValue}')">` +
    `<div class="chord-carousel">` +
    carousel +
    `<div id="${id}-count">1 of ${voicings.length}</div>` +
    `</div>` +
    `<div class="arrow" data-popper-arrow></div>` +
    `</div>`
  );
}

module.exports = {
  chordCarousel,
};
