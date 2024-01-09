/**
 * @jest-environment jsdom
 */

import { parseChord } from "../lib/chord.js";
import { chordCarousel } from "./chord_carousel.js";

describe("Chord carousel", () => {
  test("should display count of chords", () => {
    expect(chordCarousel(parseChord("C"), () => "SVG")).toMatch(/1 of 5/);
  });

  test("should display left and right buttons", () => {
    expect(chordCarousel(parseChord("C"), () => "SVG")).toMatch(/❮/);
    expect(chordCarousel(parseChord("C"), () => "SVG")).toMatch(/❯/);
  });
});
