'use strict';

const chordPattern = new RegExp([
  '^',
  '([CDEFGAB](?:#|b)?)',
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
  '(?:/([CDEFGAB](?:#|b)?))?',
  '$'
].join(''));

const chordSequenceSharp = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const chordSequenceFlat = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

function transpose(note, amount) {
  if (note == '') {
    return '';
  }

  let chordSequence = chordSequenceSharp;
  let index = chordSequence.indexOf(note);

  if (index == -1) {
    chordSequence = chordSequenceFlat;
    index = chordSequence.indexOf(note);
  }

  const nextIndex = mod(index + amount, chordSequence.length);
  return chordSequence[nextIndex];
}

function mod(n, m) {
  return ((n % m) + m) % m;
}

class Chord {
  constructor(root, quality, bass) {
    this.root = root;
    this.quality = quality || '';
    this.bass = bass || '';
  }

  toString() {
    let result = this.root + this.quality;
    if (this.bass) {
      result += '/' + this.bass;
    }
    return result;
  }

  transpose(amount) {
    return new Chord(transpose(this.root, amount), this.quality, transpose(this.bass, amount));
  }

  static isChord(str) {
    return str.match(chordPattern) ? true : false;
  }

  static parse(str) {
    const tokens = str.match(chordPattern);
    return new Chord(tokens[1], tokens[2], tokens[3]);
  }
}

module.exports = Chord;
