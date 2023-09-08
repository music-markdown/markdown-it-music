/**
 * @jest-environment jsdom
 */

"use strict";

const rewire = require("rewire");
const { parseChord } = require("../lib/chord");

const chordCarouselJs = rewire("./chord_carousel.js");
chordCarouselJs.__set__("document", document);
chordCarouselJs.__get__("chordDiagram").renderChordDiagram = jest.fn(
  () => "SVG",
);

const chordCarousel = chordCarouselJs.__get__("chordCarousel");

describe("Chord carousel", () => {
  test("should display count of chords", () => {
    expect(chordCarousel(parseChord("C"))).toMatch(/1 of 5/);
  });

  test("should display left and right buttons", () => {
    expect(chordCarousel(parseChord("C"))).toMatch(/❮/);
    expect(chordCarousel(parseChord("C"))).toMatch(/❯/);
  });
});
