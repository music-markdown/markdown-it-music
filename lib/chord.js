"use strict";

const ANNOTATION_PATTERN = /^(\||\([^)]+\))$/;

const CHORD_PATTERN = new RegExp(
  [
    "^",
    "([CDEFGAB](?:#|b)?|N.C.)",
    "(",
    "maj|maj7|maj9|maj11|maj13|maj9#11|maj13#11|add9|maj7b5|maj7#5|",
    "m|m7|m9|m9/6|m11|m13|m6|madd9|m6add9|m7add9|mmaj7|mmaj9|m7b5|m7#5|",
    "5|",
    "6|6/9|",
    "7|7/6|7sus4|7b5|7#5|7b9|7#9|7b5b9|7b5#9|7#5b9|7b9#5|",
    "7aug|7aug5|7aug9|7dim5|7dim9|7sus2|7sus4|",
    "9|9/6|9b5|9#5|9aug5|9dim5|9sus|9sus4|",
    "11|11b9|11dim9|11aug|",
    "13|13#11|13b9|13b9b5|13dim9|13dim11|",
    "add2|add4|add9|",
    "aug|",
    "dim|dim5|dim7|dim11|dim13|",
    "sus|sus2|sus4|sus2sus4|",
    ")?",
    "(?:/([CDEFGAB](?:#|b)?))?",
    "$",
  ].join(""),
);

const NOTE_SEQUENCE = new Map(
  [
    "",
    "A",
    "A#",
    "Bb",
    "B",
    "C",
    "C#",
    "Db",
    "D",
    "D#",
    "Eb",
    "E",
    "F",
    "F#",
    "Gb",
    "G",
    "G#",
    "Ab",
  ].map((note, index) => [note, index]),
);

const CHORD_SEQUENCE_SHARP = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
];
const CHORD_SEQUENCE_FLAT = [
  "C",
  "Db",
  "D",
  "Eb",
  "E",
  "F",
  "Gb",
  "G",
  "Ab",
  "A",
  "Bb",
  "B",
];
const NOTE_ALIASES = new Map(
  [
    ["N.C."],
    ["C"],
    ["C#", "Db"],
    ["D"],
    ["D#", "Eb"],
    ["E"],
    ["F"],
    ["F#", "Gb"],
    ["G"],
    ["G#", "Ab"],
    ["A"],
    ["A#", "Bb"],
    ["B"],
  ].flatMap((aliases) => aliases.map((alias) => [alias, aliases])),
);

function transpose(note, amount) {
  if (note === "" || note === "N.C.") {
    return note;
  }

  let chordSequence = CHORD_SEQUENCE_SHARP;
  let index = chordSequence.indexOf(note);

  if (index == -1) {
    chordSequence = CHORD_SEQUENCE_FLAT;
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
    this.quality = quality || "";
    this.bass = bass || "";
  }

  toString() {
    let result = this.root + this.quality;
    if (this.bass) {
      result += "/" + this.bass;
    }
    return result;
  }

  toAttributeValue() {
    return this.toString()
      .replace(".", "")
      .replace("#", "shp")
      .replace("b", "flt")
      .replace("/", "ovr")
      .toLowerCase();
  }

  transpose(amount) {
    return new Chord(
      transpose(this.root, amount),
      this.quality,
      transpose(this.bass, amount),
    );
  }

  aliases() {
    const rootAliases = NOTE_ALIASES.get(this.root) || [];
    const bassAliases = this.bass ? NOTE_ALIASES.get(this.bass) || [] : [""];
    return rootAliases.flatMap((root) =>
      bassAliases.map((bass) => new Chord(root, this.quality, bass)),
    );
  }
}

function compareNotes(note1, note2) {
  return (NOTE_SEQUENCE.get(note1) || 0) - (NOTE_SEQUENCE.get(note2) || 0);
}

function compareQualities(quality1 = "", quality2 = "") {
  if (quality1.length != quality2.length) {
    return quality1.length - quality2.length;
  }
  return quality1.localeCompare(quality2);
}

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
}

function isAnnotation(str) {
  return !!str.match(ANNOTATION_PATTERN);
}

function isChord(str) {
  return !!str.match(CHORD_PATTERN);
}

function parseChord(str) {
  const tokens = str.match(CHORD_PATTERN);
  if (!tokens) {
    throw new Error(`${str} is not a valid chord`);
  }

  return new Chord(tokens[1], tokens[2], tokens[3]);
}

module.exports = {
  compareNotes,
  compareQualities,
  compareChords,
  parseChord,
  isAnnotation,
  isChord,
  Chord,
};
