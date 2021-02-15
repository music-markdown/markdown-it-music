import { Chord } from "../lib/chord";
import { Phrase, Verse, Voice } from "./verse";

export interface Event {
  index: number;
  content: string | Chord;
  voice?: string;
  offset?: number;
}

/**
 * Represents a list of events that occur during a phrase.
 *
 * An event is a list of voice objects (index, content, and name) that occur in the same block of space.
 *
 * See tests for example input/output structure.
 */
export class Line {
  spacesBetweenEvents = 0;
  previousLine: Voice = [];

  /**
   * Splits any events from the previous event list that overflow into the current event.
   *
   * For example, if a previous event is { index: 0, content: 'Wonderful' }, and the current event list begins at
   * index 5, this will split the previous event to { index: 0, content: 'Wonder' }
   * and return { index: 5, content: '-ful' } as part of the list of voices to add to the current event list.
   *
   * @param voicesAddedToEvent The voice names that have already been added to the event list.
   * @param eventIndex The start index of the current event list.
   * @return The list of voice events to add to the event list.
   */
  splitPreviousEvent(voicesAddedToEvent: string[], eventIndex: number): Voice {
    const voicesToAdd: Voice = [];

    // Split any previous events
    this.previousLine.forEach((voice) => {
      if (
        voicesAddedToEvent.indexOf(voice.voice!) === -1 &&
        eventIndex < voice.index + voice.content.toString().length - 1 &&
        typeof voice.content === "string" &&
        voice.content.substring
      ) {
        // Split voice from previous event, add remainder to this event.
        let splitIndex = eventIndex - voice.index;
        splitIndex += voice.content.startsWith("-") ? 1 : 0;
        const event: Event = {
          index: eventIndex,
          voice: voice.voice,
          content: `-${voice.content.substring(splitIndex)}`,
          offset: 0,
        };
        voice.content = voice.content.substring(0, splitIndex);

        voicesToAdd.push(event);
      }
    });

    return voicesToAdd;
  }

  /**
   * Adds one of each voice from a phrase whose content fits within the bounds of the longest event.
   *
   * To fit within the bounds, a voice event must start (voice.index) between the longest event's index and
   * the longest event's index + content length. If an voice event does not fit, that voice is skipped for this event.
   *
   * @param phrase The phrase to pick events from.
   * @param longestEvent The longest (by content length) and first voice event from phrase.
   * @param startIndex The index for the start of this event.
   * @return voiceAdded Voice names added to event list.
   * @return line List of the first of each voice from phrase that fit within bounds of longest event.
   */
  addEvents(phrase: Phrase, longestEvent: Event, startIndex: number) {
    const line: Voice = [];
    const voicesAdded: string[] = [];
    const longestEventMinIndex = longestEvent.index;
    const longestEventMaxIndex =
      longestEventMinIndex + longestEvent.content.toString().length;

    phrase.forEach((events, voiceName) => {
      if (events.length === 0) {
        return;
      }

      const event = events[0];
      // Only include an event if it falls between the longest event's start and end index.
      if (
        longestEventMinIndex <= event.index &&
        event.index < longestEventMaxIndex
      ) {
        // Look ahead to make sure this event falls before future events.
        if (
          !Array.from(phrase.values()).every((voiceEvents) => {
            return !voiceEvents[1] || voiceEvents[1].index > event.index;
          })
        ) {
          return;
        }
        const eventToAdd = events.shift()!;

        eventToAdd.voice = voiceName;
        eventToAdd.offset =
          this.spacesBetweenEvents + eventToAdd.index - startIndex;

        line.push(eventToAdd);
        voicesAdded.push(voiceName);
      }
    });

    this.spacesBetweenEvents = 1;

    return { voicesAdded, line };
  }

  /**
   * Creates a list of events from given phrase.
   *
   * @param phrase Map of voice names to voice object stack.
   * @param voiceOrder Sort order for voices.
   * @return List of event lists sorted (by voiceOrder).
   */
  createLineFromPhrase(phrase: Phrase, voiceOrder: string[]) {
    const firstEventOfEachVoice: Voice = Array.from(phrase.values()).map(
      (voiceArr) => voiceArr[0]
    );

    // Find the minimum index of all voices, since we want to parse events in the order they happen.
    const eventIndex = firstEventOfEachVoice.reduce((minimumIndex, voice) => {
      return !voice || voice.index >= minimumIndex ? minimumIndex : voice.index;
    }, Number.MAX_SAFE_INTEGER);

    // Find the longest event so we know the maximum length of this event.
    const longestEvent = firstEventOfEachVoice.reduce(
      (longestEvent: Event | undefined, currentEvent) => {
        if (!currentEvent || currentEvent.index > eventIndex) {
          return longestEvent;
        }

        if (
          !longestEvent ||
          currentEvent.content.toString().length >
            longestEvent.content.toString().length
        ) {
          return currentEvent;
        }

        return longestEvent;
      },
      undefined
    ) as Event;

    const { voicesAdded, line } = this.addEvents(
      phrase,
      longestEvent,
      eventIndex
    );

    this.previousLine = line
      .concat(this.splitPreviousEvent(voicesAdded, eventIndex))
      .sort(
        (voice1, voice2) =>
          voiceOrder.indexOf(voice1.voice!) - voiceOrder.indexOf(voice2.voice!)
      );

    return this.previousLine;
  }
}

function convertPhraseToEvents(phrase: Phrase) {
  const voiceOrder = Array.from(phrase.keys());
  const events = [];

  // create events for this phrase until there are no events left to process.
  const line = new Line();
  while (!Array.from(phrase.values()).every((arr) => arr.length === 0)) {
    events.push(line.createLineFromPhrase(phrase, voiceOrder));
  }

  return events;
}

/**
 * Converts a verse to list of event lists.
 *
 * @param verse The verse that contains phrases to be translated to events.
 * @return List of Line that represent a verse. Each phrase is represented by a single Line.
 */
export function convertVerseToEvents(verse: Verse) {
  return verse.map((phrase) => {
    return convertPhraseToEvents(phrase);
  });
}
