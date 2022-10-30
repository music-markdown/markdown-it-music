/**
 * @jest-environment jsdom
 */

"use strict";

const rewire = require("rewire");

const chordCarouselJs = rewire("./chord_carousel.js");
chordCarouselJs.__set__("document", document);
chordCarouselJs.__get__("chordDiagram").renderChordDiagram = jest.fn(
  () => "svg_here"
);

const chordCarousel = chordCarouselJs.__get__("chordCarousel");
const createDiagramDiv = chordCarouselJs.__get__("createDiagramDiv");

const svgDiagramDiv = '<div class="diagram">svg_here</div>';

describe("Chord carousel", () => {
  test("should add diagram to container", () => {
    const expectedVoiceDiv = `${svgDiagramDiv}`;

    expect(createDiagramDiv("voicing")).toEqual(expectedVoiceDiv);
  });

  test("should add chord carousel", () => {
    const expectedVoiceDiv =
      `<div class="diagram-container">` +
      `<div class="content-scroll">` +
      `<div>` +
      `<button class="scroll" ` +
      `onclick="slowScroll('chord0', 'left', 100, 2); incrementId('chord0', 'left');">` +
      `❮` +
      `</button>` +
      `</div>` +
      `<div class="diagram-content-container" id="chord0">` +
      `${svgDiagramDiv}${svgDiagramDiv}${svgDiagramDiv}${svgDiagramDiv}${svgDiagramDiv}` +
      `</div>` +
      `<div>` +
      `<button class="scroll" ` +
      `onclick="slowScroll('chord0', 'right', 100, 2); incrementId('chord0', 'right');">` +
      `❯` +
      `</button>` +
      `</div>` +
      `</div>` +
      `<div id="chord0-count">1 of 5</div>` +
      `</div>`;

    expect(chordCarousel("C")).toEqual(expectedVoiceDiv);
  });

  test("should highlight chord if diagram does not exist", () => {
    const expectedVoiceDiv = undefined;

    expect(chordCarousel("!!!!")).toEqual(expectedVoiceDiv);
  });
});
