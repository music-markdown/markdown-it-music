'use strict';

const parseVerse = require('../parsers/verse.js')['parseVerse'];
const chordHover = require('./chord_hover.js');
const { convertVerseToEvents } = require('../parsers/events.js');

const VoiceColors = require('./voice_colors.js');

class ChordsEventRenderer {
  constructor(voiceOrder, colorOrder, opts) {
    this.voiceOrder = voiceOrder;
    this.voiceColors = new VoiceColors(colorOrder, opts && opts.theme ? opts.theme : {});
    this.transposeAmount = opts ? opts.transpose : undefined;
    this.columnCount = opts && opts.columnCount ? opts.columnCount : 1;
    this.fontSize = opts && opts.fontSize ? opts.fontSize : 13;
  }

  createEventHTMLChordChart(lines) {
    // create chart div
    const chartDiv = document.createElement('div');
    chartDiv.className = 'chart';
    chartDiv.style.columnCount = this.columnCount;
    chartDiv.style.fontSize = `${this.fontSize}px`;

    // create events div for each line list
    lines.forEach((line) => {
      // create line div for each event
      chartDiv.appendChild(this.createLineDiv(line));
    });

    return chartDiv;
  }

  createLineDiv(line) {
    const lineDiv = document.createElement('div');
    lineDiv.className = 'line';

    // add all voices from event to line div
    line.forEach((event) => {
      lineDiv.appendChild(this.createEventDiv(event));
    });

    return lineDiv;
  }

  createEventDiv(event) {
    const eventDiv = document.createElement('div');
    eventDiv.className = 'event';

    let currentVoiceIndex = 0;

    event.forEach((voice) => {
      while (voice.voice !== this.voiceOrder[currentVoiceIndex]) {
        const emptyDiv = document.createElement('div');
        emptyDiv.innerHTML = ' ';

        eventDiv.appendChild(emptyDiv);
        currentVoiceIndex++;
      }

      currentVoiceIndex++;

      eventDiv.appendChild(this.createVoiceDiv(voice));
    });

    return eventDiv;
  }

  createVoiceDiv(voice) {
    const voiceStyleDiv = document.createElement('div');
    voiceStyleDiv.style.color = this.voiceColors.getVoiceColor(voice.voice);

    const voiceDiv = document.createElement('div');
    voiceDiv.className = voice.voice;

    if (voice.voice.startsWith('c')) {
      if (this.transposeAmount && typeof voice.content.transpose === 'function') {
        voice.content = voice.content.transpose(this.transposeAmount);
      }

      chordHover.addChordToDiv(voiceDiv, voice.content);
    }
    voiceDiv.innerHTML += `${' '.repeat(voice.offset)}${voice.content.toString()}`;

    voiceStyleDiv.appendChild(voiceDiv);

    return voiceStyleDiv;
  }
}

function render(str, opts) {
  const verse = parseVerse(str);
  // Get voice order from first phrase
  const voiceOrder = Array.from(verse[0].keys());

  const colorOrder = opts.theme.colorOrder || ['black', 'blue', 'red', 'green', 'purple', 'teal'];

  const chordsRenderer = new ChordsEventRenderer(voiceOrder, colorOrder, opts);
  const lines = convertVerseToEvents(verse);

  return chordsRenderer.createEventHTMLChordChart(lines).outerHTML;
}

module.exports = {
  'callback': render,
  'lang': 'chords'
};
