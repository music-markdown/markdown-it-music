"use strict";

const chordHover = require("./chord_hover.js");
const { convertVerseToEvents } = require("../parsers/events.js");

const VoiceColors = require("./voice_colors.js");

class ChordsRenderer {
  constructor(voiceOrder, colorOrder, opts) {
    this.voiceOrder = voiceOrder;
    this.currentPhraseIndex = 0;
    this.voiceColors = new VoiceColors(colorOrder, voiceOrder);

    this.setOptions(opts);
  }

  setOptions(opts) {
    this.transposeAmount = opts ? opts.transpose : undefined;
    this.fontSize = opts && opts.fontSize ? opts.fontSize : 13;
  }

  createEventHTMLChordChart(lines) {
    let chartDiv = `<div class="chart" style="font-size: ${this.fontSize}px;">`;

    lines.forEach(line => {
      // create line div for each event
      chartDiv += this.createLineDiv(line);
      this.currentPhraseIndex++;
    });

    return chartDiv + "</div>";
  }

  createLineDiv(line) {
    let lineDiv = `<div class="line">`;

    line.forEach(event => {
      lineDiv += this.createEventDiv(event);
    });

    return lineDiv + "</div>";
  }

  createEventDiv(event) {
    let eventDiv = `<div class="event">`;

    const currentVoiceOrder = this.voiceOrder[this.currentPhraseIndex];
    this.voiceColors.setVoiceColors(currentVoiceOrder);

    if (event.length > currentVoiceOrder.length) {
      console.error(
        "There are more voices than the voice order displays. Some data may be lost."
      );
    }

    currentVoiceOrder.forEach(voice => {
      if (event[0] && voice === event[0].voice) {
        eventDiv += this.createVoiceDiv(event.shift());
      } else {
        const emptyDiv = "<div> </div>";
        eventDiv += emptyDiv;
      }
    });
    return eventDiv + `</div>`;
  }

  createVoiceDiv(voice) {
    let className = `class="${voice.voice}`;
    let chordDiagram = undefined;

    if (voice.voice.startsWith("c")) {
      if (
        this.transposeAmount &&
        typeof voice.content.transpose === "function"
      ) {
        voice.content = voice.content.transpose(this.transposeAmount);
      }

      className += " chord";
      chordDiagram = chordHover.addChordToDiv(voice.content.toString());
      if (!chordDiagram) {
        className += " highlight";
      }
    }

    let voiceDiv = `<div ${className}">`;
    if (chordDiagram) {
      voiceDiv += chordDiagram;
    }

    voiceDiv += `${" ".repeat(voice.offset)}${voice.content.toString()}</div>`;

    return (
      `<div style="color: ${this.voiceColors.getVoiceColor(voice.voice)};">` +
      `${voiceDiv}` +
      `</div>`
    );
  }

  renderVerse(verse, opts) {
    this.setOptions(opts);

    this.voiceOrder = verse.map(phrase => Array.from(phrase.keys()));
    this.currentPhraseIndex = 0;

    const lines = convertVerseToEvents(verse);

    return this.createEventHTMLChordChart(lines);
  }
}

module.exports = ChordsRenderer;
