"use strict";

const { convertVerseToEvents } = require("../parsers/events.js");
const { parseVoicing } = require("../lib/voicing");
const { guitarChordbook } = require("../lib/chordbook");
const { Chord } = require("../lib/chord.js");

class ChordsRenderer {
  constructor(opts) {
    this.voiceOrder = [];
    this.transposeAmount = 0;
    this.currentPhraseIndex = 0;
    this.chordIndex = 0;
    this.chordsUsed = [];

    this.setOptions(opts);
  }

  setOptions(opts) {
    if (!opts) return;

    this.transposeAmount = opts.transpose || 0;

    if (opts.chords) {
      Object.entries(opts.chords).forEach(([chord, shorthands]) => {
        if (typeof shorthands === "string") {
          shorthands = [shorthands];
        }
        guitarChordbook.set(chord, shorthands.map(parseVoicing));
      });
    }
  }

  createEventHTMLChordChart(lines) {
    let chartDiv = `<div class="chart">`;

    lines.forEach((line) => {
      // create line div for each event
      chartDiv += this.createLineDiv(line);
      this.currentPhraseIndex++;
    });

    return chartDiv + "</div>";
  }

  createLineDiv(line) {
    let lineDiv = `<div class="line">`;

    line.forEach((event) => {
      lineDiv += this.createEventDiv(event);
    });

    return lineDiv + "</div>";
  }

  createEventDiv(event) {
    let eventDiv = `<div class="event">`;

    const currentVoiceOrder = this.voiceOrder[this.currentPhraseIndex];

    if (event.length > currentVoiceOrder.length) {
      console.error(
        "There are more voices than the voice order displays. Some data may be lost."
      );
    }

    currentVoiceOrder.forEach((voice) => {
      if (event[0] && voice === event[0].voice) {
        eventDiv += this.createVoiceDiv(event.shift());
      } else {
        const emptyDiv = "<div> </div>";
        eventDiv += emptyDiv;
      }
    });
    return eventDiv + `</div>`;
  }

  createContentSpan(voice) {
    const content = voice.content.toString();
    if (voice.content instanceof Chord) {
      if (guitarChordbook.has(content)) {
        if (!this.chordsUsed.includes(content)) {
          this.chordsUsed.push(voice.content);
        }
        const id = `${this.chordIndex++}`;
        const attrValue = voice.content.toAttributeValue();
        return (
          `<span id="chord-${id}" class="chord"` +
          ` onmouseover="showPopper('chord-${id}', '${attrValue}')"` +
          ` onmouseout="hidePopper('${attrValue}')"` +
          `>${content}</span>`
        );
      } else {
        return `<span class="chord highlight">${content}</span>`;
      }
    }
    return content;
  }

  createVoiceDiv(voice) {
    if (voice.content instanceof Chord) {
      voice.content = voice.content.transpose(this.transposeAmount);
    }

    return (
      `<div class="${voice.voice}">` +
      " ".repeat(voice.offset) +
      this.createContentSpan(voice) +
      `</div>`
    );
  }

  renderVerse(verse, opts) {
    this.setOptions(opts);

    this.voiceOrder = verse.map((phrase) => Array.from(phrase.keys()));
    this.currentPhraseIndex = 0;

    const lines = convertVerseToEvents(verse);

    return this.createEventHTMLChordChart(lines);
  }
}

module.exports = ChordsRenderer;
