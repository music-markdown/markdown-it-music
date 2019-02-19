'use strict';

const Chord = require('../instruments/chord');

class ChordsRenderer {
  constructor(chordChartJson) {
    this.chordChartJson = chordChartJson;
  }

  createHtmlChordChart() {
    const chordChartHtml = document.createElement('div');
    chordChartHtml.className = 'chart';

    this.createListOfWrappedVoices()
      .forEach((event) => {
        chordChartHtml.appendChild(event);
      });

    return chordChartHtml;
  }

  createListOfWrappedVoices() {
    // Assumes voices are sorted by index and grouped by voice.
    const voiceElements = new Map();

    this.chordChartJson.forEach((event) => {
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
      debugger;
      whitespaceDiv.innerHTML = ' '.repeat(whitespace);
      parentVoice.appendChild(whitespaceDiv);
    }

    const textDiv = document.createElement('div');
    textDiv.innerHTML = text.toString();

    parentVoice.appendChild(textDiv);
  }
}

function renderChords(str, opts) {
  const chordChartJson = [
    { index: 4, voice: 'c1', content: new Chord('G') },
    { index: 12, voice: 'c1', content: new Chord('F') },
    { index: 20, voice: 'c1', content: new Chord('Am') },
    { index: 29, voice: 'c1', content: new Chord('G') },
    { index: 40, voice: 'c1', content: new Chord('F') },
    { index: 47, voice: 'c1', content: new Chord('C') },
    { index: 4, voice: 'c2', content: new Chord('C') },
    { index: 12, voice: 'c2', content: new Chord('D') },
    { index: 20, voice: 'c2', content: new Chord('Cm') },
    { index: 29, voice: 'c2', content: new Chord('F') },
    { index: 40, voice: 'c2', content: new Chord('G') },
    { index: 47, voice: 'c2', content: new Chord('B') },
    { index: 0, voice: 'l1', content: 'The' },
    { index: 4, voice: 'l1', content: 'longest' },
    { index: 12, voice: 'l1', content: 'word' },
    { index: 17, voice: 'l1', content: 'is' },
    { index: 20, voice: 'l1', content: 'supercalifragilisticexpialidocious' },
    { index: 40, voice: 'l2', content: 'supercalifragilisticexpialidocious' },
    { index: 4, voice: 'a1', content: 'crash!' },
  ];

  const renderer = new ChordsRenderer(chordChartJson);

  const htmlChart = renderer.createHtmlChordChart();

  return htmlChart.outerHTML;
}

module.exports = {
  ChordsRenderer,
  'lang': 'chords',
  'callback': renderChords
};
