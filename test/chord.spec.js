'use strict';
const chordjs = require('../chord');

describe('chord', () => {
  test.each([
    ['C', new chordjs.Chord('C')],
    ['Cm', new chordjs.Chord('C', 'm')],
    ['C#maj7/D#', new chordjs.Chord('C#', 'maj7', 'D#')],
    ['Abm/A', new chordjs.Chord('Ab', 'm', 'A')],
    ['Bm/B', new chordjs.Chord('B', 'm', 'B')],
    ['C#m/C', new chordjs.Chord('C#', 'm', 'C')],
    ['Dbm/D', new chordjs.Chord('Db', 'm', 'D')],
    ['Em/E', new chordjs.Chord('E', 'm', 'E')],
    ['F#m/F', new chordjs.Chord('F#', 'm', 'F')],
    ['Gm/G', new chordjs.Chord('G', 'm', 'G')],
  ])('parses a %s chord as %s', (name, expected) => {
    const actual = chordjs.parse(name);
    expect(actual).toEqual(expected);
  });

  test.each([
    ['C', 2, 'D'],
    ['C', 5, 'F'],
    ['C', -1, 'B'],
    ['C', 12, 'C'],
    ['C', -12, 'C'],
    ['C/G', 2, 'D/A'],
    ['C/G', 5, 'F/C'],
    ['C/G', -1, 'B/F#'],
    ['C/G', 12, 'C/G'],
    ['C/G', -12, 'C/G'],
    ['D#', 2, 'F'],
    ['C#', 2, 'D#'],
    ['Db', 2, 'Eb'],
    ['G#', 3, 'B'],
    ['F#', 3, 'A'],
    ['Ab', 3, 'B'],
  ])('transposes %s by %i to %s', (start, amount, end) => {
    const chord = chordjs.parse(start);
    const actual = chord.transpose(amount);
    const expected = chordjs.parse(end);
    expect(actual).toEqual(expected);
  });

  test.each([
    [true, 'C'],
    [true, 'Dm'],
    [true, 'Ebmaj'],
    [true, 'F#aug'],
    [true, 'Gsus4/C'],
    [true, 'A#madd9/D'],
    [true, 'Bbdim/E'],
    [false, 'H'],
    [false, 'C/H'],
    [false, 'H/C'],
  ])('isChord returns %s for %s', (expected, chord) => {
    const actual = chordjs.isChord(chord);
    expect(actual).toEqual(expected);
  });
});
