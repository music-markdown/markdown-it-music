"use strict";

const chordDiagram = require("./chord_diagram.js");
const { guitarChordbook } = require("../lib/chordbook.js");

let nextId = 0;

function createDiagramDiv(voicing) {
  const svg = chordDiagram.renderChordDiagram(voicing);

  return `<div class="diagram">${svg}</div>`;
}

function addChordToDiv(chord) {
  if (guitarChordbook.has(chord.toString())) {
    const id = `chord${nextId++}`;

    let contentDiv = `<div class="diagram-content-container" id="${id}">`;

    const voicings = guitarChordbook.get(chord.toString());

    voicings.forEach((voicing) => {
      contentDiv += createDiagramDiv(voicing);
    });

    contentDiv += "</div>";

    const leftButton =
      `<div>` +
      `<button class="scroll" onclick="slowScroll('${id}', 'left', 100, 2); incrementId('${id}', 'left');">❮` +
      `</button></div>`;
    const rightButton =
      `<div>` +
      `<button class="scroll" onclick="slowScroll('${id}', 'right', 100, 2); incrementId('${id}', 'right');">❯` +
      `</button></div>`;

    const contentScrollDiv =
      `<div class="content-scroll">` +
      `${leftButton}` +
      `${contentDiv}` +
      `${rightButton}` +
      `</div>`;

    const countDiv = `<div id="${id}-count">1 of ${voicings.length}</div>`;

    return (
      `<div class="diagram-container">` +
      `${contentScrollDiv}` +
      `${countDiv}` +
      `</div>`
    );
  }
  return undefined;
}

module.exports = {
  addChordToDiv,
};
