'use strict';

const chordjs = require('./chord');

function renderChords(str, opts) {
  return `<b>${str}</b>`;
}

function isChordLine(line) {
  const tokens = line.split();
  console.log(tokens);
}

module.exports = {
  'lang': 'chords',
  'callback': renderChords
};
