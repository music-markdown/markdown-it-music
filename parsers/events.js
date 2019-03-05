'use strict';

let addedCharacters = 0;

function splitPreviousEvent(previousEvent, voicesAddedToEvent, eventIndex) {
  const voicesToAdd = [];

  let hasAddedCharacter = false;
  // Split any previous events
  previousEvent.forEach((voice) => {
    if (voicesAddedToEvent.indexOf(voice.voice) === -1 &&
        eventIndex < voice.index + voice.content.toString().length) {
      // Split voice from previous event, add remainder to this event.
      const splitIndex = eventIndex - voice.index + addedCharacters;
      const event = {
        index: eventIndex + addedCharacters,
        voice: voice.voice,
        content: `-${voice.content.substring(splitIndex)}`
      };
      voice.content = voice.content.substring(0, splitIndex);

      voicesToAdd.push(event);

      // Update index position to account for added character.
      if (!hasAddedCharacter) {
        addedCharacters++;
        hasAddedCharacter = true;
      }
    }
  });

  return voicesToAdd;
}

function addEvents(verse, longestEvent) {
  const voices = [];
  const voicesAdded = [];

  verse.forEach((events, voiceName) => {
    if (events.length === 0) {
      return;
    }

    const event = events[0];
    // Only include an event if it falls between the longest event's start and end index.
    if (longestEvent.index <= event.index &&
        event.index < longestEvent.index + longestEvent.content.toString().length) {
      const eventToAdd = events.shift();
      eventToAdd.voice = voiceName;
      eventToAdd.index += addedCharacters;
      voices.push(eventToAdd);
      voicesAdded.push(voiceName);
    }
  });

  return { voicesAdded, voices };
}

function createEventFromVerse(verse, voiceOrder, previousEvent = []) {
  const firstEventOfEachVoice = Array.from(verse.values()).map((voiceArr) => voiceArr[0]);

  // Find the minimum index of all voices, since we want to parse events in the order they happen.
  const eventIndex = firstEventOfEachVoice.reduce((acc, voice) => {
    return !voice || voice.index >= acc ? acc : voice.index;
  }, Number.MAX_SAFE_INTEGER);

  // Find the longest event so we know the maximum length of this event.
  const longestEvent = firstEventOfEachVoice.reduce((acc, voice) => {
    if (!voice || voice.index > eventIndex) {
      return acc;
    }

    if (!acc || voice.content.toString().length > acc.content.toString().length) {
      return voice;
    }

    return acc;
  }, undefined);

  const { voicesAdded, voices } = addEvents(verse, longestEvent);

  return voices.concat(splitPreviousEvent(previousEvent, voicesAdded, eventIndex))
    .sort((voice1, voice2) => voiceOrder.indexOf(voice1.voice) - voiceOrder.indexOf(voice2.voice));
}

function convertVersesToEvents(verses) {
  return verses.map((verse) => {
    // Deep copy the verse so that we don't remove everything from the original.
    const verseCopy = new Map(verse);
    const voiceOrder = Array.from(verseCopy.keys());
    const events = [];

    // create events for this verse until there are no events left to process.
    let eventList = [];
    while (!Array.from(verseCopy.values()).every((arr) => arr.length === 0)) {
      eventList = createEventFromVerse(verseCopy, voiceOrder, eventList);
      events.push(eventList);
    }

    return events;
  });
}

module.exports = {
  convertVersesToEvents
};
