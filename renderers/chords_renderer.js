import { Chord } from "../lib/chord.js";
import { addChordToDiv } from "./chord_hover.js";
import { convertVerseToEvents } from "../parsers/events.js";
import { guitarChordbook } from "../lib/chordbook.js";
import { parseVoicing } from "../lib/voicing.js";

export default class ChordsRenderer {
  constructor(opts) {
    this.voiceOrder = [];
    this.transposeAmount = 0;
    this.currentPhraseIndex = 0;

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

  createVoiceDiv(voice) {
    const classes = [voice.voice];
    let chordDiagram = undefined;

    if (voice.voice.startsWith("c")) {
      if (voice.content instanceof Chord) {
        voice.content = voice.content.transpose(this.transposeAmount);
      }

      classes.push("chord");
      chordDiagram =
        voice.content instanceof Chord
          ? addChordToDiv(voice.content.toString())
          : undefined;
      if (!chordDiagram) {
        classes.push("highlight");
      }
    }

    return (
      `<div class="${classes.join(" ")}">` +
      (chordDiagram ? chordDiagram : "") +
      `${" ".repeat(voice.offset)}${voice.content.toString()}</div>`
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
