"use strict";

const chordDiagram = require("./chord_diagram.js");
const { guitarChordbook } = require("../lib/chordbook.js");

function diagramDiv(voicing) {
  const svg = chordDiagram.renderChordDiagram(voicing);
  return `<div class="diagram">${svg}</div>`;
}

function chordCarousel(chord) {
  const id = `chord-${chord}`;

  const voicings = guitarChordbook.get(chord);

  const carousel =
    `<div class="carousel">` +
    `<div><button class="scroll" onclick="toggleSlide('${id}', -1);">❮</button></div>` +
    `<div id="${id}" class="diagrams">` +
    voicings.map(diagramDiv).join("") +
    `</div>` +
    `<div><button class="scroll" onclick="toggleSlide('${id}', 1);">❯</button></div>` +
    `</div>`;

  return (
    `<div id="tooltip-${chord}" class="tooltip"` +
    ` onmouseover="cancelHidePopper('${chord}')"` +
    ` onmouseout="hidePopper('${chord}')">` +
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
