'use strict';

function renderChords(str, opts) {
  return `<b>${str}</b>`;
}

module.exports = {
  'lang': 'chords',
  'callback': renderChords
};
