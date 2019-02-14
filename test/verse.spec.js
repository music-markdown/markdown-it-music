'use strict';

const Chord = require('../chord');

const rewire = require('rewire');
const versejs = rewire('../verse.js');

const parseVoice = versejs.__get__('parseVoice');
const parsePhrase = versejs.__get__('parsePhrase');
const parseVerse = versejs.__get__('parseVerse');

describe('Verse', () => {
  test('parses chord voice', () => {
    const voice = 'c1:     Am    Bm    ';
    const actual = parseVoice(voice);
    expect(actual).toEqual([
      {index: 4, voice: 'c1', content: new Chord('A', 'm')},
      {index: 10, voice: 'c1', content: new Chord('B', 'm')},
    ]);
  });

  test('parses 2nd chord voice', () => {
    const voice = 'c2:     Am    Bm    ';
    const actual = parseVoice(voice);
    expect(actual).toEqual([
      {index: 4, voice: 'c2', content: new Chord('A', 'm')},
      {index: 10, voice: 'c2', content: new Chord('B', 'm')},
    ]);
  });

  test('parses default chord voice', () => {
    const voice = 'c:     Am    Bm    ';
    const actual = parseVoice(voice);
    expect(actual).toEqual([
      {index: 4, voice: 'c1', content: new Chord('A', 'm')},
      {index: 10, voice: 'c1', content: new Chord('B', 'm')},
    ]);
  });

  test('parses text voice', () => {
    const voice = 'l1: All the leaves are brown';
    const actual = parseVoice(voice);
    expect(actual).toEqual([
      {index: 0, voice: 'l1', content: 'All'},
      {index: 4, voice: 'l1', content: 'the'},
      {index: 8, voice: 'l1', content: 'leaves'},
      {index: 15, voice: 'l1', content: 'are'},
      {index: 19, voice: 'l1', content: 'brown'},
    ]);
  });

  test('throws error when voice line is invalid', () => {
    const voice = '1c:     Am    Bm    ';
    expect(() => parseVoice(voice)).toThrowError('Voice doesn\'t match');
  });

  test('parses chord and lyric line phrase', () => {
    const phrase = [
      'c1: G        Em                      Bm',
      'l1: I didn\'t ask, you shouldn\'t have told me'
    ].join('\n');
    const actual = parsePhrase(phrase);
    expect(actual).toEqual([
      {index: 0, voice: 'c1', content: new Chord('G')},
      {index: 0, voice: 'l1', content: 'I'},
      {index: 2, voice: 'l1', content: 'didn\'t'},
      {index: 9, voice: 'c1', content: new Chord('E', 'm')},
      {index: 9, voice: 'l1', content: 'ask,'},
      {index: 14, voice: 'l1', content: 'you'},
      {index: 18, voice: 'l1', content: 'shouldn\'t'},
      {index: 28, voice: 'l1', content: 'have'},
      {index: 33, voice: 'c1', content: new Chord('B', 'm')},
      {index: 33, voice: 'l1', content: 'told'},
      {index: 38, voice: 'l1', content: 'me'},
    ]);
  });

  test('parses verse with two phrases', () => {
    const verse = [
      'c1:                    Am',
      'l1: All the leaves are brown',
      '',
      'c1: G  F          G      Esus2 E',
      'l1:       and the sky is gray.',
    ].join('\n');
    const actual = parseVerse(verse);
    expect(actual).toEqual([
      [
        {index: 0, voice: 'l1', content: 'All'},
        {index: 4, voice: 'l1', content: 'the'},
        {index: 8, voice: 'l1', content: 'leaves'},
        {index: 15, voice: 'l1', content: 'are'},
        {index: 19, voice: 'c1', content: new Chord('A', 'm')},
        {index: 19, voice: 'l1', content: 'brown'},
      ],
      [
        {index: 0, voice: 'c1', content: new Chord('G')},
        {index: 3, voice: 'c1', content: new Chord('F')},
        {index: 6, voice: 'l1', content: 'and'},
        {index: 10, voice: 'l1', content: 'the'},
        {index: 14, voice: 'c1', content: new Chord('G')},
        {index: 14, voice: 'l1', content: 'sky'},
        {index: 18, voice: 'l1', content: 'is'},
        {index: 21, voice: 'c1', content: new Chord('E', 'sus2')},
        {index: 21, voice: 'l1', content: 'gray.'},
        {index: 27, voice: 'c1', content: new Chord('E')},
      ],
    ]);
  });
});
