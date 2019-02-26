'use strict';
const SVG = require('svg.js');

class ChordBox {
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

  string(i) {
    return this.left + i * this.stringSpacing;
  }

  beam(i) {
    return this.header + i * this.fretSpacing;
  }

  fret(i) {
    return this.header + this.fretSpacing / 2 + (i - 1) * this.fretSpacing;
  }
}

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

function drawNote(draw, box, string, fret) {
  draw.circle(box.radius * 2)
    .center(box.string(string - 1), box.fret(fret))
    .fill({ color: '#000' });
}

function drawMute(draw, box, string) {
  const x = box.string(string - 1);
  const y = box.fret(0);
  const r = box.radius * 0.7;
  draw.line(x-r, y-r, x+r, y+r).stroke({ color: '#000' });
  draw.line(x-r, y+r, x+r, y-r).stroke({ color: '#000' });
}

function drawBarre(draw, box, first, last, fret) {
  const r = box.radius * 0.7;
  const x = (box.string(last - 1) + box.string(first - 1)) / 2;
  const w = box.string(last - 1) - box.string(first - 1) + 2 * r;
  draw.rect(w, 2 * r)
    .center(x, box.fret(fret)).radius(r)
    .fill({ color: '#000' });
}

function drawFretOffset(draw, box, offset) {
  draw.text(`${offset}fr`)
    .font({ size: box.radius * 2, family: 'Arial' })
    .center((box.right + box.width) / 2, box.fret(1));
}

function drawChordDiagram(fingering, width=100, height=100,
  frets=5, strings=6, tuning=['E', 'A', 'D', 'G', 'B', 'e']) {
  const div = window.document.createElement('div');
  const draw = new SVG(div).size(width, height);
  const box = new ChordBox(0, 0, width, height, frets, strings);

  drawDiagram(draw, box, tuning);

  const fretOffset = fingering.fretOffset || 0;
  if (fretOffset > 0) {
    drawFretOffset(draw, box, fretOffset);
  }

  for (const { string } of fingering.mutes || []) {
    drawMute(draw, box, string);
  }

  for (const { string, fret } of fingering.notes || []) {
    drawNote(draw, box, string, fret - fretOffset);
  }

  for (const { first, last, fret } of fingering.barres || []) {
    drawBarre(draw, box, first, last, fret - fretOffset);
  }

  return div.innerHTML;
}

module.exports = {
  drawChordDiagram,
};
