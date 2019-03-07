'use strict';

const rewire = require('rewire');

const chordHoverJs = rewire('./chord_hover.js');
chordHoverJs.__set__('document', document);
chordHoverJs.__get__('chordDiagram').renderChordDiagram = jest.fn(() => 'svg_here');

const addChordToDiv = chordHoverJs.__get__('addChordToDiv');

const svgDiagramDiv = '<div class="diagram">svg_here</div>';

describe('Chord hover', () => {
  test('should add diagram and chord class', () => {
    const voiceDiv = document.createElement('div');

    addChordToDiv(voiceDiv, 'C');

    const expectedVoiceDiv = `<div class=" chord">${svgDiagramDiv}</div>`;

    expect(voiceDiv.outerHTML).toEqual(expectedVoiceDiv);
  });

  test('should highlight chord if diagram does not exist', () => {
    const voiceDiv = document.createElement('div');

    addChordToDiv(voiceDiv, '!!!!');

    const expectedVoiceDiv = '<div class=" chord highlight"></div>';

    expect(voiceDiv.outerHTML).toEqual(expectedVoiceDiv);
  });
});
