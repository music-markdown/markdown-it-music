'use strict';

const parseVerse = require('../parsers/verse.js')['parseVerse'];

function createHtmlChordChart(verse) {
  const chordChartHtml = document.createElement('div');
  chordChartHtml.className = 'chart';

  verse.forEach((phrase) => {
    const verseDiv = document.createElement('div');
    verseDiv.className = 'verse';

    createListOfWrappedVoices(phrase)
      .forEach((event) => {
        verseDiv.appendChild(event);
      });

    chordChartHtml.appendChild(verseDiv);
  });

  return chordChartHtml;
}

function createListOfWrappedVoices(phrase) {
  // Assumes voices are sorted by index and grouped by voice.
  // TODO: update structure of phrase to be explicit about voice grouping.
  const voiceElements = new Map();

  phrase.forEach((event) => {
    if (!voiceElements.has(event.voice)) {
      voiceElements.set(event.voice, new Map([['index', 0], ['parentElement', document.createElement('div')]]));

      voiceElements.get(event.voice).get('parentElement').className = event.voice;
    }

    const voice = voiceElements.get(event.voice);
    appendVoiceContentDiv(voice.get('parentElement'), event.content, event.index - voice.get('index'));

    voice.set('index', event.index + event.content.toString().length);
  });

  // Voices should have an order. The chords should be first, followed by all other voices.
  // All voices should also be grouped, so that l1 and l2 appear together.
  const voiceElementsList = [];

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

  const htmlChart = createHtmlChordChart(verse);

  return htmlChart.outerHTML;
}

module.exports = {
  'lang': 'chords',
  'callback': renderChords
};
