import { parseChord, isChord, isAnnotation } from "../lib/chord.js";

const voicePattern = /^([a-zA-Z-_]+)([0-9]*):\s(.*)/;

function normalizeToken(instrument, token) {
  if (instrument == "c") {
    if (isChord(token)) {
      return parseChord(token);
    }
    if (isAnnotation(token)) {
      return token;
    }
    throw new Error(`Invalid token: ${token}`);
  }
  return token;
}

function tokenize(instrument, data) {
  const re = /[^\s]+/g;
  const events = [];

  let match;
  while ((match = re.exec(data))) {
    events.push({
      index: match.index,
      content: normalizeToken(instrument, match[0]),
    });
  }

  return events;
}

export function isVoiceLine(line) {
  return line.match(voicePattern);
}

export function parseVoice(voice) {
  if (!voice) {
    return;
  }

  const match = voice.match(voicePattern);
  if (!match) {
    throw new Error(`Voice doesn't match ${voicePattern}: ${voice}`);
  }

  const instrument = match[1];
  const data = match[3];

  return tokenize(instrument, data);
}

export function parsePhrase(phrase) {
  return phrase.split(/\n/).reduce((phrase, voice) => {
    if (voice) {
      const match = voice.match(voicePattern);
      const voiceName = `${match[1]}${match[2] || "1"}`;
      phrase.set(voiceName, parseVoice(voice));
    }
    return phrase;
  }, new Map());
}

export function parseVerse(verse) {
  return verse.split(/[\n]{2,}/).map((phrase) => parsePhrase(phrase));
}
