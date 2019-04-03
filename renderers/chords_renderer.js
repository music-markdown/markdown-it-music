'use strict';

const parseVerse = require('../parsers/verse.js')['parseVerse'];
const chordHover = require('./chord_hover.js');
const { convertVerseToEvents } = require('../parsers/events.js');

const VoiceColors = require('./voice_colors.js');

class ChordsEventRenderer {
  constructor(voiceOrder, colorOrder, opts) {
    this.voiceOrder = voiceOrder;
    this.currentPhraseIndex = 0;
    this.voiceColors = new VoiceColors(colorOrder);
    this.transposeAmount = opts ? opts.transpose : undefined;
    this.columnCount = opts && opts.columnCount ? opts.columnCount : 1;
    this.fontSize = opts && opts.fontSize ? opts.fontSize : 13;
  }

  createEventHTMLChordChart(lines) {
    let chartDiv = `<div class="chart" style="column-count: ${this.columnCount}; font-size: ${this.fontSize}px;">`;

    lines.forEach((line) => {
      // create line div for each event
      chartDiv += this.createLineDiv(line);
      this.currentPhraseIndex++;
    });

    return chartDiv + '</div>';
  }

  createLineDiv(line) {
    let lineDiv = `<div class="line">`;

    line.forEach((event) => {
      lineDiv += this.createEventDiv(event);
    });

    return lineDiv + '</div>';
  }

  createEventDiv(event) {
    let eventDiv = `<div class="event">`;

    const currentVoiceOrder = this.voiceOrder[this.currentPhraseIndex];

    if (event.length > currentVoiceOrder.length) {
      console.error('There are more voices than the voice order displays. Some data map be lost.');
    }

    currentVoiceOrder.forEach((voice) => {
      if (event[0] && voice === event[0].voice) {
        eventDiv += this.createVoiceDiv(event.shift());
      } else {
        const emptyDiv = '<div> </div>';
        eventDiv += emptyDiv;
      }
    });
    return eventDiv + `</div>`;
  }

  createVoiceDiv(voice) {
    let className = `class="${voice.voice}`;
    let chordDiagram = undefined;

    if (voice.voice.startsWith('c')) {
      if (this.transposeAmount && typeof voice.content.transpose === 'function') {
        voice.content = voice.content.transpose(this.transposeAmount);
      }

      className += ' chord';
      chordDiagram = chordHover.addChordToDiv(voice.content);
      if (!chordDiagram) {
        className += ' highlight';
      }
    }

    let voiceDiv = `<div ${className}">`;
    if (chordDiagram) {
      voiceDiv += chordDiagram;
    }

    voiceDiv += `${' '.repeat(voice.offset)}${voice.content.toString()}</div>`;

    return `<div style="color: ${this.voiceColors.getVoiceColor(voice.voice)};">` +
      `${voiceDiv}` +
      `</div>`;
  }
}

function render(str, opts) {
  const verse = parseVerse(str);

  const voiceOrder = verse.map((phrase) => Array.from(phrase.keys()));

  const colorOrder = ['black', 'blue', 'red', 'green', 'purple', 'teal'];

  const chordsRenderer = new ChordsEventRenderer(voiceOrder, colorOrder, opts);
  const lines = convertVerseToEvents(verse);

  return chordsRenderer.createEventHTMLChordChart(lines);
}

module.exports = {
  'callback': render,
  'lang': 'chords'
};
