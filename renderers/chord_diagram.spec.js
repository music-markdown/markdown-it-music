'use strict';

const rewire = require('rewire');
const chordDiagramJs = rewire('./chord_diagram.js');

const parseShorthand = chordDiagramJs.__get__('parseShorthand');

describe('Chord Diagram Renderer', () => {
  test('parses shorthand offset', () => {
    const actual = parseShorthand('o2');
    const expected = { offset: 2, mutes: [], notes: [], barres: [] };
    expect(actual).toEqual(expected);
  });

  test('parses shorthand mutes', () => {
    const actual = parseShorthand('m1 m2');
    const expected = {
      mutes: [{ string: 1 }, { string: 2 }],
      offset: 1, notes: [], barres: []
    };
    expect(actual).toEqual(expected);
  });

  test('parses shorthand notes', () => {
    const actual = parseShorthand('n3,2 n4,3');
    const expected = {
      notes: [{ string: 3, fret: 2 }, { string: 4, fret: 3 }],
      offset: 1, mutes: [], barres: []
    };
    expect(actual).toEqual(expected);
  });

  test('parses shorthand barres', () => {
    const actual = parseShorthand('b1,6,1');
    const expected = {
      barres: [{ first: 1, last: 6, fret: 1 }],
      offset: 1, mutes: [], notes: []
    };
    expect(actual).toEqual(expected);
  });

  test('parses full shorthand expression', () => {
    const actual = parseShorthand('o2 m1 m2 n3,3 n4,5 b5,6,5');
    const expected = {
      offset: 2,
      mutes: [{ string: 1 }, { string: 2 }],
      notes: [{ string: 3, fret: 3 }, { string: 4, fret: 5 }],
      barres: [{ first: 5, last: 6, fret: 5 }]
    };
    expect(actual).toEqual(expected);
  });

  test('missing offset value throws error', () => {
    expect(() => parseShorthand('o')).toThrowError('takes exactly 1');
  });

  test('offset with 2 values throws error', () => {
    expect(() => parseShorthand('o1,2')).toThrowError('takes exactly 1');
  });

  test('missing mutes value throws error', () => {
    expect(() => parseShorthand('m')).toThrowError('takes exactly 1');
  });

  test('mutes with 2 values throws error', () => {
    expect(() => parseShorthand('m1,2')).toThrowError('takes exactly 1');
  });

  test('missing notes value throws error', () => {
    expect(() => parseShorthand('n')).toThrowError('takes exactly 2');
  });

  test('notes with 1 value throws error', () => {
    expect(() => parseShorthand('n1')).toThrowError('takes exactly 2');
  });

  test('missing barres value throws error', () => {
    expect(() => parseShorthand('b')).toThrowError('takes exactly 3');
  });

  test('barres with 2 values throws error', () => {
    expect(() => parseShorthand('b1,6')).toThrowError('takes exactly 3');
  });

  test('invalid rule type throws error', () => {
    expect(() => parseShorthand('a1')).toThrowError('Unknown rule');
  });
});
