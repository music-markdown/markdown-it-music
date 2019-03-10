'use strict';

/**
 * Represents a list of events that occur during a phrase.
 *
 * An event is a list of voice objects (index, content, and name) that occur in the same block of space.
 *
 * See tests for example input/output structure.
 */
class Line {
  constructor() {
    this.spacesBetweenEvents = 0;
    this.addedCharacters = 0;
    this.previousLine = [];
  }

  /**
   * Splits any events from the previous event list that overflow into the current event.
   *
   * For example, if a previous event is { index: 0, content: 'Wonderful' }, and the current event list begins at
   * index 5, this will split the previous event to { index: 0, content: 'Wonder' }
   * and return { index: 5, content: '-ful' } as part of the list of voices to add to the current event list.
   *
   * @param {String[]} voicesAddedToEvent The voice names that have already been added to the event list.
   * @param {number} eventIndex The start index of the current event list.
   * @return {Object[]} The list of voice events to add to the event list.
   */
  splitPreviousEvent(voicesAddedToEvent, eventIndex) {
    const voicesToAdd = [];

    let hasAddedCharacter = false;
    // Split any previous events
    this.previousLine.forEach((voice) => {
      if (voicesAddedToEvent.indexOf(voice.voice) === -1 &&
          eventIndex < voice.index + voice.content.toString().length) {
        // Split voice from previous event, add remainder to this event.
        const splitIndex = eventIndex - voice.index + this.addedCharacters;
        const event = {
          index: eventIndex + this.addedCharacters,
          voice: voice.voice,
          content: `-${voice.content.substring(splitIndex)}`,
          offset: 0
        };
        voice.content = voice.content.substring(0, splitIndex);

        voicesToAdd.push(event);

        // Update index position to account for added character.
        if (!hasAddedCharacter) {
          this.addedCharacters++;
          hasAddedCharacter = true;
        }
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
   * @param {Map<String, Object[]>} phrase The phrase to pick events from.
   * @param {Object} longestEvent The longest (by content length) and first voice event from phrase.
   * @param {number} startIndex The index for the start of this event.
   * @return {String[]} voiceAdded Voice names added to event list.
   * @return {Object[]} line List of the first of each voice from phrase that fit within bounds of longest event.
   */
  addEvents(phrase, longestEvent, startIndex) {
    const line = [];
    const voicesAdded = [];

    phrase.forEach((events, voiceName) => {
      if (events.length === 0) {
        return;
      }

      const event = events[0];
      // Only include an event if it falls between the longest event's start and end index.
      if (longestEvent.index <= event.index &&
          event.index < longestEvent.index + longestEvent.content.toString().length) {
        const eventToAdd = events.shift();

        eventToAdd.voice = voiceName;
        eventToAdd.offset = this.spacesBetweenEvents + eventToAdd.index - startIndex;
        eventToAdd.index += this.addedCharacters;

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
   * @param {Map<String, Object[]>} phrase Map of voice names to voice object stack.
   * @param {String[]} voiceOrder Sort order for voices.
   * @return {Object[]} List of event lists sorted (by voiceOrder).
   */
  createLineFromPhrase(phrase, voiceOrder) {
    const firstEventOfEachVoice = Array.from(phrase.values()).map((voiceArr) => voiceArr[0]);

    // Find the minimum index of all voices, since we want to parse events in the order they happen.
    const eventIndex = firstEventOfEachVoice.reduce((minimumIndex, voice) => {
      return !voice || voice.index >= minimumIndex ? minimumIndex : voice.index;
    }, Number.MAX_SAFE_INTEGER);

    // Find the longest event so we know the maximum length of this event.
    const longestEvent = firstEventOfEachVoice.reduce((currentLongestEvent, voice) => {
      if (!voice || voice.index > eventIndex) {
        return currentLongestEvent;
      }

      if (!currentLongestEvent || voice.content.toString().length > currentLongestEvent.content.toString().length) {
        return voice;
      }

      return currentLongestEvent;
    }, undefined);

    const { voicesAdded, line } = this.addEvents(phrase, longestEvent, eventIndex);

    this.previousLine = line.concat(this.splitPreviousEvent(voicesAdded, eventIndex))
      .sort((voice1, voice2) => voiceOrder.indexOf(voice1.voice) - voiceOrder.indexOf(voice2.voice));

    return this.previousLine;
  }
}

/**
 * Converts a verse to list of event lists.
 *
 * @param {Object} verse The verse that contains phrases to be translated to events.
 * @return {Line[]} List of Line that represent a verse. Each phrase is represented by a single Line.
 */
function convertVerseToEvents(verse) {
  return verse.map((phrase) => {
    // TODO: This is meant to deep copy the phrase map so we don't remove from the array.
    // This is a shallow copy, and does not actually deep copy the array values.
    const phraseCopy = new Map(phrase);
    const voiceOrder = Array.from(phraseCopy.keys());
    const events = [];

    // create events for this phrase until there are no events left to process.
    const line = new Line();
    while (!Array.from(phraseCopy.values()).every((arr) => arr.length === 0)) {
      events.push(line.createLineFromPhrase(phraseCopy, voiceOrder));
    }

    return events;
  });
}

module.exports = {
  convertVerseToEvents
};
