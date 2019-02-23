'use strict';

const parseVerse = require('../parsers/verse.js')['parseVerse'];

function createHtmlChordChart(verse, opts) {
  const chordChartHtml = document.createElement('div');
  chordChartHtml.className = 'chart';

  verse.forEach((phrase) => {
    const verseDiv = document.createElement('div');
    verseDiv.className = 'verse';

    createListOfWrappedVoices(phrase, opts ? opts.transpose : undefined)
      .forEach((event) => {
        verseDiv.appendChild(event);
      });

    chordChartHtml.appendChild(verseDiv);
  });

  return chordChartHtml;
}

function createListOfWrappedVoices(phrase, transposeAmount) {
  // Assumes voices are sorted by index and grouped by voice.
  const voiceElements = new Map();

  phrase.forEach((events, voiceName) => {
    events.forEach((event) => {
      if (!voiceElements.has(voiceName)) {
        voiceElements.set(voiceName, new Map([['index', 0], ['parentElement', document.createElement('div')]]));

        voiceElements.get(voiceName).get('parentElement').className = voiceName;
      }

      if (transposeAmount && voiceName.startsWith('c') && typeof event.content.transpose === 'function') {
        event.content = event.content.transpose(transposeAmount);
      }

      const voice = voiceElements.get(voiceName);
      appendVoiceContentDiv(voice.get('parentElement'), event.content, event.index - voice.get('index'));

      voice.set('index', event.index + event.content.toString().length);
    });
  });

  const voiceElementsList = [];

  // voiceElements map is ordered by key insertion, which is provided by parsed+ordered json.
  // This means converting the map to a flat list will be the order we want to append all voice divs.
  voiceElements.forEach((voice) => {
    voiceElementsList.push(voice.get('parentElement'));
  });

  return voiceElementsList;
}

function appendVoiceContentDiv(parentVoice, text, whitespace) {
  if (whitespace) {
    const whitespaceDiv = document.createElement('div');
    whitespaceDiv.innerHTML = ' '.repeat(whitespace);
    parentVoice.appendChild(whitespaceDiv);
  }

  const textDiv = document.createElement('div');
  textDiv.innerHTML = text.toString();

  parentVoice.appendChild(textDiv);
}

function renderChords(str, opts) {
  const verse = parseVerse(str);

  const htmlChart = createHtmlChordChart(verse, opts);

  return htmlChart.outerHTML;
}

module.exports = {
  'lang': 'chords',
  'callback': renderChords
};
