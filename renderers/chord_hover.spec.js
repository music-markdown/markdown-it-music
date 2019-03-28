'use strict';

const rewire = require('rewire');

const chordHoverJs = rewire('./chord_hover.js');
chordHoverJs.__set__('document', document);
chordHoverJs.__get__('chordDiagram').renderChordDiagram = jest.fn(() => 'svg_here');

const addChordToDiv = chordHoverJs.__get__('addChordToDiv');
const createDiagramDiv = chordHoverJs.__get__('createDiagramDiv');
const slowScrollFunction = chordHoverJs.__get__('slowScrollFunction');
const incrementIdFunction = chordHoverJs.__get__('incrementIdFunction');

jest.useFakeTimers();

const svgDiagramDiv = '<div class="diagram">svg_here</div>';

describe('Chord hover', () => {
  test('should add diagram to container', () => {
    const voiceDiv = document.createElement('div');

    createDiagramDiv('voicing', voiceDiv);

    const expectedVoiceDiv = `<div>${svgDiagramDiv}</div>`;
    expect(voiceDiv.outerHTML).toEqual(expectedVoiceDiv);
  });
  test('should add diagram and chord class with navigation', () => {
    const voiceDiv = document.createElement('div');

    addChordToDiv(voiceDiv, 'C');

    const expectedVoiceDiv = `<div class=" chord">` +
      `<div class="diagram-container">` +
        `<div class="content-scroll">` +
          `<div>` +
            `<button class="scroll" ` +
              `onclick="slowScroll('chord0', 'left', 100, 2); incrementId('chord0', 'left');">` +
                `❮` +
            `</button>` +
          `</div>` +
          `<div class="diagram-content-container" id="chord0">` +
            `${svgDiagramDiv}${svgDiagramDiv}${svgDiagramDiv}` +
          `</div>` +
          `<div>` +
            `<button class="scroll" ` +
              `onclick="slowScroll('chord0', 'right', 100, 2); incrementId('chord0', 'right');">` +
                `❯` +
            `</button>` +
          `</div>` +
        `</div>` +
        `<div id="chord0-count">1 of 3</div>` +
      `</div>` +
    `</div>`;

    expect(voiceDiv.outerHTML).toEqual(expectedVoiceDiv);
  });

  test('should highlight chord if diagram does not exist', () => {
    const voiceDiv = document.createElement('div');

    addChordToDiv(voiceDiv, '!!!!');

    const expectedVoiceDiv = '<div class=" chord highlight"></div>';

    expect(voiceDiv.outerHTML).toEqual(expectedVoiceDiv);
  });

  describe('buttons', () => {
    let voiceDiv;
    const id = 'chord0';

    beforeAll(() => {
      eval(slowScrollFunction);
      eval(incrementIdFunction);
    });

    beforeEach(() => {
      if (voiceDiv) {
        document.getElementsByTagName('body')[0].removeChild(voiceDiv);
      }
      chordHoverJs.__set__('nextId', 0);
      voiceDiv = document.createElement('div');

      addChordToDiv(voiceDiv, 'C');

      document.getElementsByTagName('body')[0].appendChild(voiceDiv);
    });

    test('buttons should scroll div right', () => {
      const scrollDistance = 100;
      slowScroll(id, 'right', scrollDistance, 2);
      jest.advanceTimersByTime(1000);

      expect(document.getElementById(id).scrollLeft).toEqual(scrollDistance);
    });

    test('buttons should scroll div right then left, to get back to original localtion', () => {
      const scrollDistance = 100;
      slowScroll(id, 'right', scrollDistance, 2);
      jest.advanceTimersByTime(100);

      slowScroll(id, 'left', scrollDistance, 2);
      jest.advanceTimersByTime(100);

      expect(document.getElementById(id).scrollLeft).toEqual(0);
    });

    test('buttons should increment values when scrolling right', () => {
      incrementId(id, 'right');

      expect(document.getElementById(`${id}-count`).innerHTML).toEqual('2 of 3');
    });

    test('buttons should decrement values when scrolling left', () => {
      incrementId(id, 'right');
      incrementId(id, 'left');

      expect(document.getElementById(`${id}-count`).innerHTML).toEqual('1 of 3');
    });

    test('buttons should not increment over the max value', () => {
      incrementId(id, 'right');
      incrementId(id, 'right');
      incrementId(id, 'right');

      expect(document.getElementById(`${id}-count`).innerHTML).toEqual('3 of 3');
    });

    test('buttons should not decrement below zero', () => {
      incrementId(id, 'left');

      expect(document.getElementById(`${id}-count`).innerHTML).toEqual('1 of 3');
    });
  });
});
