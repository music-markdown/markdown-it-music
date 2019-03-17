'use strict';

const { parseVoicing, compareVoicings } = require('../lib/voicing');

const guitarChordLibrary = new Map();

function addGuitarChord(name, shorthand) {
  if (!guitarChordLibrary.has(name)) {
    guitarChordLibrary.set(name, []);
  }
  guitarChordLibrary.get(name).push(parseVoicing(shorthand));
  guitarChordLibrary.get(name).sort(compareVoicings);
}

addGuitarChord('C', 'm1 n2,3 n3,2 n5,1');
addGuitarChord('C7', 'm1 n2,3 n3,2 n4,3 n5,1');

addGuitarChord('D', 'm1 m2 n4,2 n5,3 n6,2');
addGuitarChord('Dm', 'm1 m2 n4,2 n5,3 n6,1');
addGuitarChord('D7', 'm1 m2 n4,2 n5,1 n6,2');
addGuitarChord('Dm7', 'm1 m2 n4,2 n5,1 n6,1');

addGuitarChord('E', 'n2,2 n3,2 n4,1');
addGuitarChord('Em', 'n2,2 n3,2');
addGuitarChord('E7', 'n2,2 n3,2 n4,1');
addGuitarChord('Em7', 'n2,2 n3,2 n5,3');

addGuitarChord('G', 'n1,3 n2,2 n5,3 n6,3');
addGuitarChord('G7', 'n1,3 n2,2 n6,1');

addGuitarChord('A', 'm1 n3,2 n4,2 n5,2');
addGuitarChord('Am', 'm1 n3,2 n4,2 n5,1');
addGuitarChord('A7', 'm1 n3,2 n5,2');
addGuitarChord('Am7', 'm1 n3,2 n5,1');

for (const [note, os] of [
  ['F', 0], ['F#', 1], ['Gb', 1], ['G', 2], ['G#', 3], ['Ab', 3], ['A', 4],
  ['A#', 5], ['Bb', 5], ['B', 6], ['C', 7], ['C#', 8], ['Db', 8], ['D', 9],
  ['D#', 10], ['Eb', 10], ['E', 11], ['F', 12]]) {
  addGuitarChord(`${note}`,
    `o${1+os} b1,6,${1+os} n2,${3+os} n3,${3+os} n4,${2+os}`);
  addGuitarChord(`${note}m`,
    `o${1+os} b1,6,${1+os} n2,${3+os} n3,${3+os}`);
  addGuitarChord(`${note}7`,
    `o${1+os} b1,6,${1+os} n2,${3+os} n4,${2+os} n5,${4+os}`);
  addGuitarChord(`${note}m7`,
    `o${1+os} b1,6,${1+os} n3,${3+os}`);
  addGuitarChord(`${note}sus4`,
    `o${1+os} b1,6,${1+os} n2,${3+os} n3,${3+os} n4,${3+os}`);
  addGuitarChord(`${note}7sus4`,
    `o${1+os} b1,6,${1+os} n2,${3+os} n4,${3+os}`);
}

for (const [note, os] of [
  ['A#', 0], ['Bb', 0], ['B', 1], ['C', 2], ['C#', 3], ['Db', 3], ['D', 4],
  ['D#', 5], ['Eb', 5], ['E', 6], ['F', 7], ['F#', 8], ['Gb', 8], ['G', 9],
  ['G#', 10], ['Ab', 10], ['A', 11], ['A#', 12], ['Bb', 12]]) {
  addGuitarChord(`${note}`,
    `o${1+os} m1 b2,6,${1+os} n3,${3+os} n4,${3+os} n5,${3+os}`);
  addGuitarChord(`${note}m`,
    `o${1+os} m1 b2,6,${1+os} n3,${3+os} n4,${3+os} n5,${2+os}`);
  addGuitarChord(`${note}7`,
    `o${1+os} m1 b2,6,${1+os} n3,${3+os} n5,${3+os}`);
  addGuitarChord(`${note}m7`,
    `o${1+os} m1 b2,6,${1+os} n3,${3+os} n5,${2+os}`);
  addGuitarChord(`${note}M7`,
    `o${1+os} m1 b2,6,${1+os} n3,${3+os} n4,${2+os} n5,${3+os}`);
  addGuitarChord(`${note}sus2`,
    `o${1+os} m1 b2,6,${1+os} n3,${3+os} n4,${3+os}`);
  addGuitarChord(`${note}sus4`,
    `o${1+os} m1 b2,6,${1+os} n3,${3+os} n4,${3+os} n5,${4+os}`);
  addGuitarChord(`${note}7sus4`,
    `o${1+os} m1 b2,6,${1+os} n3,${3+os} n5,${4+os}`);
}

module.exports = {
  guitarChordLibrary
};
