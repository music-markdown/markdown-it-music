import { addChordToDiv } from "./chord_hover";
import { convertVerseToEvents, Event } from "../parsers/events";
import { parseVoicing } from "../lib/voicing";
import { guitarChordbook } from "../lib/chordbook";
import { Verse, Voice } from "../parsers/verse";
import { Chord } from "../lib/chord";

export default class ChordsRenderer {
  voiceOrder: string[][] = [];
  transposeAmount: number = 0;
  currentPhraseIndex: number = 0;

  setOptions(opts: MmdOptions) {
    if (!opts) return;

    this.transposeAmount = opts.transpose;

    if (opts.chords) {
      const x = Object.entries(opts.chords);
      Object.entries(opts.chords).forEach(([chord, shorthands]) => {
        if (typeof shorthands === "string") {
          shorthands = [shorthands];
        }
        guitarChordbook.set(chord, shorthands.map(parseVoicing));
      });
    }
  }

  createEventHTMLChordChart(lines: Voice[][]) {
    let chartDiv = `<div class="chart">`;

    lines.forEach((line) => {
      // create line div for each event
      chartDiv += this.createLineDiv(line);
      this.currentPhraseIndex++;
    });

    return chartDiv + "</div>";
  }

  createLineDiv(line: Voice[]) {
    let lineDiv = `<div class="line">`;

    line.forEach((event) => {
      lineDiv += this.createEventDiv(event);
    });

    return lineDiv + "</div>";
  }

  createEventDiv(event: Event[]) {
    let eventDiv = `<div class="event">`;

    const currentVoiceOrder = this.voiceOrder[this.currentPhraseIndex];

    if (event.length > currentVoiceOrder.length) {
      console.error(
        "There are more voices than the voice order displays. Some data may be lost."
      );
    }

    currentVoiceOrder.forEach((voice) => {
      if (event[0] && voice === event[0].voice) {
        eventDiv += this.createVoiceDiv(event.shift()!);
      } else {
        const emptyDiv = "<div> </div>";
        eventDiv += emptyDiv;
      }
    });
    return eventDiv + `</div>`;
  }

  createVoiceDiv(voice: Event) {
    const classes = [voice.voice];
    let chordDiagram = undefined;

    if (voice.voice!.startsWith("c")) {
      if (this.transposeAmount && voice.content instanceof Chord) {
        voice.content = voice.content.transpose(this.transposeAmount);
      }

      classes.push("chord");
      chordDiagram =
        voice.content instanceof Chord
          ? addChordToDiv(voice.content)
          : undefined;
      if (!chordDiagram) {
        classes.push("highlight");
      }
    }

    return (
      `<div class="${classes.join(" ")}">` +
      (chordDiagram ? chordDiagram : "") +
      `${" ".repeat(voice.offset!)}${voice.content.toString()}</div>`
    );
  }

  renderVerse(verse: Verse, opts: MmdOptions) {
    this.setOptions(opts);

    this.voiceOrder = verse.map((phrase) => Array.from(phrase.keys()));
    this.currentPhraseIndex = 0;

    const lines = convertVerseToEvents(verse);

    return this.createEventHTMLChordChart(lines);
  }
}
