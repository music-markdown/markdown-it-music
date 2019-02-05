'use strict';

const chords = new RegExp([
  '([CDEFGAB])',
  '(#|##|b|bb)?',
  '(',
  'maj|maj7|maj9|maj11|maj13|maj9#11|maj13#11|add9|maj7b5|maj7#5|',
  'm|m7|m9|m11|m13|m6|',
  'madd9|m\\(add9\\)|m6add9|m6\\(add9\\)|m7add9|m7\\(add9\\)|',
  'mmaj7|m\\(maj7\\)|mmaj9|m\\(maj9\\)|m7b5|m7#5|',
  '5|',
  '6|6/9|',
  '7|7sus4|7b5|7#5|7b9|7#9|7b5b9|7b5#9|7#5b9|7+5|7+9|7-5|7-9|',
  '7aug|7aug5|7dim5|7dim9|7sus2|7sus4|',
  '9|9#5|9aug5|9dim5|9sus|9sus4|',
  '11|11b9|11dim9|',
  '13|13#11|13b9|13dim9|13dim11|',
  'add2|add4|add9|',
  'aug|',
  'dim|dim7|dim11|dim13|',
  'sus|sus4|sus2|sus2sus4|',
  '-5',
  ')?',
  '(?:(/)([CDEFGAB])(#|##|b|bb)?)?'
].join(''));

function renderChords(str, opts) {
  console.log(opts);
  return `<b>${str}</b>`;
}

module.exports = {
  'lang': 'chords',
  'callback': renderChords
};
