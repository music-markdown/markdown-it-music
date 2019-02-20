'use strict';

const parseVerse = require('../verse.js')['parseVerse'];

class ChordsRenderer {
  constructor(chordChartJson) {
    this.chordChartJson = chordChartJson;
  }

  createHtmlChordChart() {
    const chordChartHtml = document.createElement('div');
    chordChartHtml.className = 'chart';

    this.chordChartJson.forEach((verse) => {
      const verseDiv = document.createElement('div');
      verseDiv.className = 'verse';

      this.createListOfWrappedVoices(verse)
        .forEach((event) => {
          verseDiv.appendChild(event);
        });

      chordChartHtml.appendChild(verseDiv);
    });

    return chordChartHtml;
  }

  createListOfWrappedVoices(verse) {
    // Assumes voices are sorted by index and grouped by voice.
    const voiceElements = new Map();

    verse.forEach((event) => {
      if (!voiceElements.has(event.voice)) {
        voiceElements.set(event.voice, new Map([['index', 0], ['parentElement', document.createElement('div')]]));

        voiceElements.get(event.voice).get('parentElement').className = event.voice;
      }

      const voice = voiceElements.get(event.voice);
      this.appendVoiceContentDiv(voice.get('parentElement'), event.content, event.index - voice.get('index'));

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

  appendVoiceContentDiv(parentVoice, text, whitespace) {
    if (whitespace) {
      const whitespaceDiv = document.createElement('div');
      whitespaceDiv.innerHTML = ' '.repeat(whitespace);
      parentVoice.appendChild(whitespaceDiv);
    }

    const textDiv = document.createElement('div');
    textDiv.innerHTML = text.toString();

    parentVoice.appendChild(textDiv);
  }
}

function renderChords(str, opts) {
  const chordChartJson = parseVerse(str);
  const renderer = new ChordsRenderer(chordChartJson);

  const htmlChart = renderer.createHtmlChordChart();

  return htmlChart.outerHTML;
}

module.exports = {
  ChordsRenderer,
  'lang': 'chords',
  'callback': renderChords
};
