"use strict";
const memoize = require("fast-memoize");

const { SVG } = require("@svgdotjs/svg.js");

/** Represents the dimensions of a chord diagram. */
class ChordBox {
  /**
   * Create a ChordBox.
   * @param {number} x Left most position for drawing.
   * @param {number} y Right-most position for drawing.
   * @param {number} width Width of the chord diagram.
   * @param {number} height Height of the chord diagram.
   * @param {number} frets Number of frets in the chord diagram.
   * @param {number} strings Number of strings in the chord diagram.
   */
  constructor(x, y, width, height, frets, strings) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.frets = frets;
    this.strings = strings;

    this.stringSpacing = this.width / (this.strings - 1 + 3);
    this.fretSpacing = this.height / (this.frets + 2);
    this.radius = Math.min(this.stringSpacing, this.fretSpacing) * 0.35;
    this.header = this.fretSpacing * 1;
    this.footer = this.height - this.fretSpacing * 1;
    this.left = this.x + this.stringSpacing * 1.5;
    this.right = this.width - this.stringSpacing * 1.5;
  }

  /**
   * Gets the X coordinate for the string.
   * @param {number} i The string index starting from 1.
   * @return {number} The X coordinate.
   * */
  string(i) {
    return this.left + i * this.stringSpacing;
  }

  /**
   * Gets the Y coordinate for the beam. The bridge is beam(0).
   * @param {number} i The beam index starting from 0.
   * @return {number} The Y coordinate.
   * */
  beam(i) {
    return this.header + i * this.fretSpacing;
  }

  /**
   * Gets the Y coordinate for the fret. Area above the bridge is fret(0).
   * @param {number} i The fret index starting from 1.
   * @return {number} The Y coordinate.
   * */
  fret(i) {
    return this.header + this.fretSpacing / 2 + (i - 1) * this.fretSpacing;
  }
}

/**
 * Renders the bridge, frets, strings and string tunings.
 * @param {SVG.Doc} draw The graphics context.
 * @param {ChordBox} box The ChordBox dimensions.
 * @param {string[]} tuning The tuning of the strings.
 */
function drawDiagram(draw, box, tuning) {
  // Draw Bridge
  draw
    .line(box.left, box.header, box.right, box.header)
    .stroke({ color: "#000", width: 2 });

  // Draw Frets
  for (let i = 1; i <= box.frets; i++) {
    const y = box.beam(i);
    draw.line(box.left, y, box.right, y).stroke({ color: "#999" });
  }

  // Draw Strings and Tuning
  for (let i = 0; i < box.strings; i++) {
    const x = box.string(i);
    draw.line(x, box.header, x, box.footer).stroke({ color: "#000" });
    draw
      .plain(tuning[i])
      .font({ size: box.radius * 2, family: "Arial" })
      .center(x, (box.footer + box.height) / 2);
  }
}

/**
 * Renders a single fingering on a given string and fret.
 * @param {SVG.Doc} draw The graphics context.
 * @param {ChordBox} box The ChordBox dimensions.
 * @param {number} string The string index starting from 1.
 * @param {number} fret The fret index starting from 1.
 */
function drawNote(draw, box, string, fret) {
  draw
    .circle(box.radius * 2)
    .center(box.string(string - 1), box.fret(fret))
    .fill({ color: "#000" });
}

/**
 * Renders a mute symbol above the bridge for the given string.
 * @param {SVG.Doc} draw The graphics context.
 * @param {ChordBox} box The ChordBox dimensions.
 * @param {number} string The string index starting from 1.
 */
function drawMute(draw, box, string) {
  const x = box.string(string - 1);
  const y = box.fret(0);
  const r = box.radius * 0.7;
  draw.line(x - r, y - r, x + r, y + r).stroke({ color: "#000" });
  draw.line(x - r, y + r, x + r, y - r).stroke({ color: "#000" });
}

/**
 * Renders a barre at the given fret across the strings from first to last.
 * @param {SVG.Doc} draw The graphics context.
 * @param {ChordBox} box The ChordBox dimensions.
 * @param {number} first The index of the first string starting from 1.
 * @param {number} last The index of the last string starting from 1.
 * @param {number} fret The fret index starting from 1.
 */
function drawBarre(draw, box, first, last, fret) {
  const r = box.radius * 0.7;
  const x = (box.string(last - 1) + box.string(first - 1)) / 2;
  const w = box.string(last - 1) - box.string(first - 1) + 2 * r;
  draw
    .rect(w, 2 * r)
    .center(x, box.fret(fret))
    .radius(r)
    .fill({ color: "#000" });
}

/**
 * Renders the fret offset to the right of the first fret.
 * @param {SVG.Doc} draw The graphics context.
 * @param {ChordBox} box The ChordBox dimensions.
 * @param {number} offset The fret offset.
 */
function drawFretOffset(draw, box, offset) {
  draw
    .plain(`${offset}fr`)
    .font({ size: box.radius * 2, family: "Arial" })
    .center((box.right + box.width) / 2, box.fret(1));
}

/**
 * Renders a chord diagram given a voicing.
 *
 * @param {Voicing} voicing The fingering for the chord diagram.
 * @param {number} width The width of the chord diagram.
 * @param {number} height The height of the chord diagram.
 * @param {number} frets The number of frets.
 * @param {string[]} tuning The tuning of each string as an array.
 * @return {string} The rendered chord diagram as SVG.
 */
function renderChordDiagram(voicing, width, height, frets, tuning) {
  // Specify defaults here so as to not confuse memoize:
  // https://github.com/caiogondim/fast-memoize.js/issues/68
  width = width || 100;
  height = height || 100;
  frets = frets || 5;
  tuning = tuning || ["E", "A", "D", "G", "B", "e"];

  const strings = tuning.length;
  const draw = SVG().size(width, height);
  const box = new ChordBox(0, 0, width, height, frets, strings);

  drawDiagram(draw, box, tuning);

  if (voicing.offset > 1) {
    drawFretOffset(draw, box, voicing.offset);
  }

  for (const { string } of voicing.mutes) {
    drawMute(draw, box, string);
  }

  for (const { string, fret } of voicing.notes) {
    drawNote(draw, box, string, fret - voicing.offset + 1);
  }

  for (const { first, last, fret } of voicing.barres) {
    drawBarre(draw, box, first, last, fret - voicing.offset + 1);
  }

  return draw.svg();
}

module.exports = {
  renderChordDiagram: memoize(renderChordDiagram)
};
