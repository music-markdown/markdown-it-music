"use strict";

class Voicing {
  constructor(offset = 1, mutes = [], notes = [], barres = []) {
    this.offset = offset;
    this.mutes = mutes;
    this.notes = notes;
    this.barres = barres;
  }
}

const compareVoicings = (voicing1, voicing2) => {
  let cmp = voicing1.offset - voicing2.offset;
  if (cmp != 0) {
    return cmp;
  }
  cmp = voicing1.barres.length - voicing2.barres.length;
  if (cmp != 0) {
    return cmp;
  }
  return (
    voicing1.mutes.length +
    voicing1.notes.length -
    (voicing2.mutes.length + voicing2.notes.length)
  );
};

/**
 * Parses the voicing string and returns a voicing object.
 *
 * Here's an example of a voicing string: "o2 m1 m2 n3,3 n4,5 b5,6,5"
 *
 * - o2:     The chord diagram should be rendered starting from the 2nd fret.
 * - m1:     The 1st string should be rendered muted (marked with an x).
 * - m2:     The 2nd string should be rendered muted.
 * - n3,3:   The 3rd string should be played on the 3rd fret.
 * - n4,5:   The 4th string should be played on the 5th fret.
 * - b5,6,5: The 5th through 6th strings should be barred on the 5th fret.
 *
 * @param {string} str The voicing using our shorthand notation.
 * @return {Object} The parsed fingering.
 */
function parseVoicing(str) {
  const voicing = new Voicing();
  if (!str) {
    return voicing;
  }

  for (const rule of str.split(/\s/)) {
    const ruleType = rule.charAt(0);
    const params = rule
      .substr(1)
      .split(",")
      .map(num => parseInt(num));
    if (ruleType == "o") {
      if (params.length != 1 || params.includes(NaN)) {
        throw new Error(`Offset (o) rule takes exactly 1 integer argument`);
      }
      voicing.offset = params[0];
    } else if (ruleType == "m") {
      if (params.length != 1 || params.includes(NaN)) {
        throw new Error(`Mute (m) rule takes exactly 1 integer argument`);
      }
      voicing.mutes.push({ string: params[0] });
    } else if (ruleType == "n") {
      if (params.length != 2 || params.includes(NaN)) {
        throw new Error(`Note (n) rule takes exactly 2 integer arguments`);
      }
      voicing.notes.push({ string: params[0], fret: params[1] });
    } else if (ruleType == "b") {
      if (params.length != 3 || params.includes(NaN)) {
        throw new Error(`Barre (b) rule takes exactly 3 integer arguments`);
      }
      voicing.barres.push({
        first: params[0],
        last: params[1],
        fret: params[2]
      });
    } else {
      throw new Error(`Unknown rule type: ${ruleType}`);
    }
  }

  return voicing;
}

module.exports = {
  parseVoicing,
  compareVoicings
};
