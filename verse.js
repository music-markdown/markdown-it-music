'use strict';

const Chord = require('./chord');
const voicePattern = /^([a-zA-Z-_]+)([0-9]*):\s(.*)/;

function tokenize(instrument, voice, data) {
  const re = /[^\s]+/g;
  const events = [];

  let match;
  while (match = re.exec(data)) {
    events.push({
      index: match.index,
      voice: voice,
      content: instrument == 'c' ? Chord.parse(match[0]) : match[0]
    });
  }

  return events;
}

function parseVoice(voice) {
  const match = voice.match(voicePattern);
  if (!match) {
    throw new Error(`Voice doesn't match ${voicePattern}: ${voice}`);
  }

  const voiceId = `${match[1]}${match[2] || '1'}`;
  const instrument = match[1];
  const data = match[3];

  return tokenize(instrument, voiceId, data);
}

function parsePhrase(phrase) {
  return phrase.split(/\n/)
    .flatMap((voice) => parseVoice(voice))
    .sort((e1, e2) => e1.index - e2.index);
}

function parseVerse(verse) {
  return verse.split(/[\n]{2,}/)
    .map((phrase) => parsePhrase(phrase));
}

module.exports = {
  parseVerse
};
