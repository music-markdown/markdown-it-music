import {
  Chord,
  compareChords,
  parseChord,
  isChord,
  isAnnotation,
} from "./chord.js";

describe("Chord", () => {
  test.each([
    ["A", "A#"],
    ["A", "Am"],
    ["A7", "Am"],
    ["Am", "Asus4"],
    ["A", "B"],
    ["Asus4", "B"],
  ])("%s is before %s", (c1, c2) => {
    const actual = compareChords(parseChord(c1), parseChord(c2));
    expect(actual).toBeLessThan(0);
  });

  test.each([
    ["Ab", "A"],
    ["C#", "C"],
    ["Dm", "D"],
    ["Dsus4", "D7"],
    ["E", "Eb"],
    ["E", "D#"],
    ["C/G", "C"],
  ])("%s is after %s", (c1, c2) => {
    const actual = compareChords(parseChord(c1), parseChord(c2));
    expect(actual).toBeGreaterThan(0);
  });

  test.each([
    ["C", "C"],
    ["D", "D"],
    ["Eb", "Eb"],
    ["D#", "D#"],
    ["C/G", "C/G"],
  ])("%s is equal to %s", (c1, c2) => {
    const actual = compareChords(parseChord(c1), parseChord(c2));
    expect(actual).toEqual(0);
  });

  test("chords are correctly sorted", () => {
    const actual = ["Gsus4", "Am", "F", "D", "Gsus4", "Abm", "D#7", "A7"]
      .map((str) => parseChord(str))
      .sort(compareChords)
      .map((chord) => chord.toString());
    const expected = ["A7", "Am", "D", "D#7", "F", "Gsus4", "Gsus4", "Abm"];
    expect(actual).toEqual(expected);
  });

  test.each([
    ["C", new Chord("C")],
    ["Cm", new Chord("C", "m")],
    ["C#maj7/D#", new Chord("C#", "maj7", "D#")],
    ["Abm/A", new Chord("Ab", "m", "A")],
    ["Bm/B", new Chord("B", "m", "B")],
    ["C#m/C", new Chord("C#", "m", "C")],
    ["Dbm/D", new Chord("Db", "m", "D")],
    ["Em/E", new Chord("E", "m", "E")],
    ["F#m/F", new Chord("F#", "m", "F")],
    ["Gm/G", new Chord("G", "m", "G")],
  ])("parses a %s chord as %s", (name, expected) => {
    const actual = parseChord(name);
    expect(actual).toEqual(expected);
  });

  test.each([
    ["C", 2, "D"],
    ["C", 5, "F"],
    ["C", -1, "B"],
    ["C", 12, "C"],
    ["C", -12, "C"],
    ["C/G", 2, "D/A"],
    ["C/G", 5, "F/C"],
    ["C/G", -1, "B/F#"],
    ["C/G", 12, "C/G"],
    ["C/G", -12, "C/G"],
    ["D#", 2, "F"],
    ["C#", 2, "D#"],
    ["Db", 2, "Eb"],
    ["G#", 3, "B"],
    ["F#", 3, "A"],
    ["Ab", 3, "B"],
  ])("transposes %s by %i to %s", (start, amount, end) => {
    const chord = parseChord(start);
    const actual = chord.transpose(amount);
    const expected = parseChord(end);
    expect(actual).toEqual(expected);
  });

  test.each([
    [true, "C"],
    [true, "Dm"],
    [true, "Ebmaj"],
    [true, "F#aug"],
    [true, "Gsus4/C"],
    [true, "A#madd9/D"],
    [true, "Bbdim/E"],
    [false, "H"],
    [false, "C/H"],
    [false, "H/C"],
    [true, "N.C."],
    [false, "|"],
    [false, "(x2)"],
  ])("isChord returns %s for %s", (expected, chord) => {
    const actual = isChord(chord);
    expect(actual).toEqual(expected);
  });

  test.each([
    [true, "|"],
    [true, "(x2)"],
    [false, "C"],
    [false, "Dm"],
    [false, "Ebmaj"],
    [false, "F#aug"],
    [false, "Gsus4/C"],
    [false, "A#madd9/D"],
    [false, "Bbdim/E"],
  ])("isAnnotation returns %s for %s", (expected, chord) => {
    const actual = isAnnotation(chord);
    expect(actual).toEqual(expected);
  });

  test.each([
    ["c", "C"],
    ["dm", "Dm"],
    ["efltmaj", "Ebmaj"],
    ["fshpaug", "F#aug"],
    ["gsus4ovrc", "Gsus4/C"],
    ["ashpmadd9ovrd", "A#madd9/D"],
    ["bfltdimovre", "Bbdim/E"],
  ])("toAttributeValue returns %s for %s", (expected, chord) => {
    const actual = parseChord(chord).toAttributeValue();
    expect(actual).toEqual(expected);
  });

  test.each([
    ["C", ["C"]],
    ["C/G", ["C/G"]],
    ["C#", ["C#", "Db"]],
    ["Eb", ["D#", "Eb"]],
    ["F#/G#", ["F#/G#", "F#/Ab", "Gb/G#", "Gb/Ab"]],
  ])("%s has aliases [%s]", (chord, aliases) => {
    const actual = parseChord(chord).aliases();
    const expected = aliases.map((c) => parseChord(c));
    expect(actual).toEqual(expected);
  });

  test("throws error when chord is invalid", () => {
    expect(() => parseChord("Ef")).toThrowError("Ef is not a valid chord");
  });
});
