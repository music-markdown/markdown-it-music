'use strict';

const chordDiagram = require('./chord_diagram.js');
const { guitarChordLibrary } = require('./chord_library.js');

function addChordToDiv(voiceDiv, chord) {
  voiceDiv.className += ' chord';

  if (guitarChordLibrary.has(chord.toString())) {
    const chordDiagramDiv = document.createElement('div');
    chordDiagramDiv.className = 'diagram';

    const voicings = guitarChordLibrary.get(chord.toString());
    const svgs = voicings.map((voicing) => chordDiagram.renderChordDiagram(voicing));

    // TODO: Provide a way to scroll through several chord diagrams.
    chordDiagramDiv.innerHTML = svgs[0];
    voiceDiv.appendChild(chordDiagramDiv);
  } else {
    voiceDiv.className += ' highlight';
  }
}

module.exports = {
  addChordToDiv
};
