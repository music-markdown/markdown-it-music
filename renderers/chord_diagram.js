'use strict';
const SVG = require('svg.js');

class ChordBox {
  constructor(x, y, w, h, frets, strings) {
    console.log(w);
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.frets = frets;
    this.strings = strings;

    this.stringSpacing = this.w / (this.strings - 1 + 3);
    this.fretSpacing = this.h / (this.frets + 2);
    this.r = Math.min(this.stringSpacing, this.fretSpacing) * 0.35;
    this.header = this.fretSpacing * 1;
    this.footer = this.h - this.fretSpacing * 1;
    this.left = this.x + this.stringSpacing * 1.5;
    this.right = this.w - this.stringSpacing * 1.5;
  }

  getStringX(i) {
    return this.left + i * this.stringSpacing;
  }

  getBeamY(i) {
    return this.header + i * this.fretSpacing;
  }

  getFretY(i) {
    return this.header + this.fretSpacing / 2 + (i - 1) * this.fretSpacing;
  }
}

function drawDiagram(draw, box, tuning) {
  // Draw Bridge
  draw.line(box.left, box.header, box.right, box.header).stroke({ width: 2 });

  // Draw Frets
  for (let i = 1; i <= box.frets; i++) {
    const y = box.getBeamY(i);
    draw.line(box.left, y, box.right, y).stroke({ color: '#999' });
  }

  // Draw Strings and Tuning
  for (let i = 0; i < box.strings; i++) {
    const x = box.getStringX(i);
    draw.line(x, box.header, x, box.footer).stroke({ color: '#000' });
    draw.text(tuning[i]).font({ size: box.r * 2, family: 'Arial' })
      .center(x, (box.footer + box.h) / 2);
  }
}

function drawNote(draw, box, string, fret) {
  draw.circle(box.r * 2)
    .center(box.getStringX(string - 1), box.getFretY(fret))
    .fill({ color: '#000' });
}

function drawMute(draw, box, string) {
  const x = box.getStringX(string - 1);
  const y = box.getFretY(0);
  const r = box.r * 0.7;
  draw.line(x-r, y-r, x+r, y+r).stroke({ color: '#000' });
  draw.line(x-r, y+r, x+r, y-r).stroke({ color: '#000' });
}

function drawBarre(draw, box, first, last, fret) {
  const r = box.r * 0.7;
  const x = (box.getStringX(last - 1) + box.getStringX(first - 1)) / 2;
  const w = box.getStringX(last - 1) - box.getStringX(first - 1) + 2 * r;
  draw.rect(w, 2 * r)
    .center(x, box.getFretY(fret)).radius(r)
    .fill({ color: '#000' });
}

function drawFretOffset(draw, box, offset) {
  draw.text(`${offset}fr`)
    .font({ size: box.r * 2, family: 'Arial' })
    .center((box.right + box.w) / 2, box.getFretY(1));
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
