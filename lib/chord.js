'use strict';

const CHORD_PATTERN = new RegExp([
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

const NOTE_SEQUENCE = new Map(
  ['', 'A', 'A#', 'Bb', 'B', 'C', 'C#', 'Db', 'D', 'D#', 'Eb', 'E', 'F', 'F#', 'Gb', 'G', 'G#', 'Ab']
    .map((note, index) => [note, index]));

const CHORD_SEQUENCE_SHARP = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const CHORD_SEQUENCE_FLAG = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

function transpose(note, amount) {
  if (note == '') {
    return '';
  }

  let chordSequence = CHORD_SEQUENCE_SHARP;
  let index = chordSequence.indexOf(note);

  if (index == -1) {
    chordSequence = CHORD_SEQUENCE_FLAG;
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
}

const compareNotes = (note1, note2) => NOTE_SEQUENCE.get(note1) - NOTE_SEQUENCE.get(note2);

function compareQualities(quality1 = '', quality2 = '') {
  if (quality1.length != quality2.length) {
    return quality1.length - quality2.length;
  }
  return quality1.localeCompare(quality2);
};

function compareChords(chord1, chord2) {
  let cmp = compareNotes(chord1.root, chord2.root);
  if (cmp != 0) {
    return cmp;
  }
  cmp = compareQualities(chord1.quality, chord2.quality);
  if (cmp != 0) {
    return cmp;
  }
  return compareNotes(chord1.bass, chord2.bass);
};

function isChord(str) {
  return !!str.match(CHORD_PATTERN);
}

function parseChord(str) {
  const tokens = str.match(CHORD_PATTERN);
  if (!tokens) {
    // Unable to parse the chord, assume it is an annotation in a chord line.
    return str;
  }
  return new Chord(tokens[1], tokens[2], tokens[3]);
}

module.exports = {
  compareNotes,
  compareQualities,
  compareChords,
  parseChord,
  isChord,
  Chord,
};
