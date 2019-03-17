'use strict';
const memoize = require('fast-memoize');
const SVG = require('svg.js');

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
  draw.line(box.left, box.header, box.right, box.header).stroke({ width: 2 });

  // Draw Frets
  for (let i = 1; i <= box.frets; i++) {
    const y = box.beam(i);
    draw.line(box.left, y, box.right, y).stroke({ color: '#999' });
  }

  // Draw Strings and Tuning
  for (let i = 0; i < box.strings; i++) {
    const x = box.string(i);
    draw.line(x, box.header, x, box.footer).stroke({ color: '#000' });
    draw.text(tuning[i]).font({ size: box.radius * 2, family: 'Arial' })
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
  draw.circle(box.radius * 2)
    .center(box.string(string - 1), box.fret(fret))
    .fill({ color: '#000' });
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
  draw.line(x-r, y-r, x+r, y+r).stroke({ color: '#000' });
  draw.line(x-r, y+r, x+r, y-r).stroke({ color: '#000' });
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
  draw.rect(w, 2 * r)
    .center(x, box.fret(fret)).radius(r)
    .fill({ color: '#000' });
}

/**
 * Renders the fret offset to the right of the first fret.
 * @param {SVG.Doc} draw The graphics context.
 * @param {ChordBox} box The ChordBox dimensions.
 * @param {number} offset The fret offset.
 */
function drawFretOffset(draw, box, offset) {
  draw.text(`${offset}fr`)
    .font({ size: box.radius * 2, family: 'Arial' })
    .center((box.right + box.width) / 2, box.fret(1));
}

/**
 * Parses the fingering shorthand and returns a fingering object.
 *
 * Here's an example of a fingering shortand: "o2 m1 m2 n3,3 n4,5 b5,6,5"
 *
 * - o2:     The chord diagram should be rendered starting from the 2nd fret.
 * - m1:     The 1st string should be rendered muted (marked with an x).
 * - m2:     The 2nd string should be rendered muted.
 * - n3,3:   The 3rd string should be played on the 3rd fret.
 * - n4,5:   The 4th string should be played on the 5th fret.
 * - b5,6,5: The 5th through 6th strings should be barred on the 5th fret.
 *
 * @param {string} shorthand The fingering shorthand.
 * @return {Object} The parsed fingering.
 */
function parseShorthand(shorthand) {
  const fingering = {
    offset: 1,
    mutes: [],
    notes: [],
    barres: []
  };

  for (const rule of shorthand.split(/\s/)) {
    const ruleType = rule.charAt(0);
    const params = rule.substr(1).split(',').map((num) => parseInt(num));
    if (ruleType == 'o') {
      if (params.length != 1 || params.includes(NaN)) {
        throw new Error(`Offset (o) rule takes exactly 1 integer argument`);
      }
      fingering.offset = params[0];
    } else if (ruleType == 'm') {
      if (params.length != 1 || params.includes(NaN)) {
        throw new Error(`Mute (m) rule takes exactly 1 integer argument`);
      }
      fingering.mutes.push({ string: params[0] });
    } else if (ruleType == 'n') {
      if (params.length != 2 || params.includes(NaN)) {
        throw new Error(`Note (n) rule takes exactly 2 integer arguments`);
      }
      fingering.notes.push({ string: params[0], fret: params[1] });
    } else if (ruleType == 'b') {
      if (params.length != 3 || params.includes(NaN)) {
        throw new Error(`Barre (b) rule takes exactly 3 integer arguments`);
      }
      fingering.barres.push({ first: params[0], last: params[1], fret: params[2] });
    } else {
      throw new Error(`Unknown rule type: ${ruleType}`);
    }
  }

  return fingering;
}

/**
 * Renders a chord diagram given a fingering shorthand.
 *
 * @param {string} shorthand The fingering shorthand for the chord diagram.
 * @param {number} width The width of the chord diagram.
 * @param {number} height The height of the chord diagram.
 * @param {number} frets The number of frets.
 * @param {string[]} tuning The tuning of each string as an array.
 * @return {string} The rendered chord diagram as SVG.
 */
function renderChordDiagram(shorthand, width, height, frets, tuning) {
  // Specify defaults here so as to not confuse memoize:
  // https://github.com/caiogondim/fast-memoize.js/issues/68
  width = width || 100;
  height = height || 100;
  frets = frets || 5;
  tuning = tuning || ['E', 'A', 'D', 'G', 'B', 'e'];

  const fingering = parseShorthand(shorthand);
  const strings = tuning.length;
  const div = window.document.createElement('div');
  const draw = new SVG(div).size(width, height);
  const box = new ChordBox(0, 0, width, height, frets, strings);

  drawDiagram(draw, box, tuning);

  if (fingering.offset > 1) {
    drawFretOffset(draw, box, fingering.offset);
  }

  for (const { string } of fingering.mutes) {
    drawMute(draw, box, string);
  }

  for (const { string, fret } of fingering.notes) {
    drawNote(draw, box, string, fret - fingering.offset + 1);
  }

  for (const { first, last, fret } of fingering.barres) {
    drawBarre(draw, box, first, last, fret - fingering.offset + 1);
  }

  return div.innerHTML;
}

module.exports = {
  renderChordDiagram: memoize(renderChordDiagram),
};
