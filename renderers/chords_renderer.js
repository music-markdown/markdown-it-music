'use strict';

const parseVerse = require('../parsers/verse.js')['parseVerse'];
const chordDiagram = require('./chord_diagram.js');
const { guitarChordLibrary } = require('./chord_library.js');
const randomColor = require('randomcolor');

class VoiceColors {
  constructor() {
    this.colors = ['blue', 'black', 'red', 'green', 'purple', 'teal'];
    this.voiceColorMap = {};
  }

  getUnusedColor() {
    return this.colors.length > 0 ? this.colors.shift() : randomColor({ seed: 42 });
  }

  getVoiceColor(voice) {
    if (!(voice in this.voiceColorMap)) {
      this.voiceColorMap[voice] = this.getUnusedColor();
    }

    return this.voiceColorMap[voice];
  }
}

function createHtmlChordChart(verse, opts) {
  const chordChartHtml = document.createElement('div');
  chordChartHtml.className = 'chart';

  const voiceColors = new VoiceColors();

  verse.forEach((phrase) => {
    const verseDiv = document.createElement('div');
    verseDiv.className = 'verse';

    createListOfWrappedVoices(phrase, opts ? opts.transpose : undefined, voiceColors)
      .forEach((event) => {
        verseDiv.appendChild(event);
      });

    chordChartHtml.appendChild(verseDiv);
  });

  return chordChartHtml;
}

function createListOfWrappedVoices(phrase, transposeAmount, voiceColors) {
  // Assumes voices are sorted by index and grouped by voice.
  const voiceElements = new Map();

  phrase.forEach((events, voiceName) => {
    if (!voiceElements.has(voiceName)) {
      voiceElements.set(voiceName, new Map([['index', 0], ['parentElement', document.createElement('div')]]));
    }

    const color = voiceColors.getVoiceColor(voiceName);

    events.forEach((event) => {
      if (transposeAmount && voiceName.startsWith('c') && typeof event.content.transpose === 'function') {
        event.content = event.content.transpose(transposeAmount);
      }

      const voice = voiceElements.get(voiceName);
      voice.get('parentElement').className = 'voice';
      voice.get('parentElement').style.color = color;
      appendVoiceContentDiv(voice.get('parentElement'), event.content, event.index - voice.get('index'), voiceName);

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

function appendVoiceContentDiv(parentVoice, text, whitespace, className) {
  if (whitespace) {
    const whitespaceDiv = document.createElement('div');
    whitespaceDiv.innerHTML = ' '.repeat(whitespace);
    parentVoice.appendChild(whitespaceDiv);
  }

  const textDiv = document.createElement('div');
  textDiv.className = className;

  if (className.startsWith('c')) {
    textDiv.className += ' chord';

    if (guitarChordLibrary.has(text.toString())) {
      const chordDiagramDiv = document.createElement('div');
      chordDiagramDiv.className = 'diagram';

      const shorthands = guitarChordLibrary.get(text.toString());
      const svgs = shorthands.map(
        (shorthand) => chordDiagram.renderChordDiagram(shorthand));
      // TODO: Provide a way to scroll through several chord diagrams.
      chordDiagramDiv.innerHTML = svgs[0];
      textDiv.appendChild(chordDiagramDiv);
    }
  }

  textDiv.innerHTML += text.toString();

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
