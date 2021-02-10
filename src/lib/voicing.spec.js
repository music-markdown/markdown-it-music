"use strict";

const { parseVoicing, compareVoicings } = require("./voicing");

describe("Voicing", () => {
  test("parses empty shorthand", () => {
    const actual = parseVoicing("");
    const expected = { offset: 1, mutes: [], notes: [], barres: [] };
    expect(actual).toEqual(expected);
  });

  test("parses shorthand offset", () => {
    const actual = parseVoicing("o2");
    const expected = { offset: 2, mutes: [], notes: [], barres: [] };
    expect(actual).toEqual(expected);
  });

  test("parses shorthand mutes", () => {
    const actual = parseVoicing("m1 m2");
    const expected = {
      mutes: [{ string: 1 }, { string: 2 }],
      offset: 1,
      notes: [],
      barres: [],
    };
    expect(actual).toEqual(expected);
  });

  test("parses shorthand notes", () => {
    const actual = parseVoicing("n3,2 n4,3");
    const expected = {
      notes: [
        { string: 3, fret: 2 },
        { string: 4, fret: 3 },
      ],
      offset: 1,
      mutes: [],
      barres: [],
    };
    expect(actual).toEqual(expected);
  });

  test("parses shorthand barres", () => {
    const actual = parseVoicing("b1,6,1");
    const expected = {
      barres: [{ first: 1, last: 6, fret: 1 }],
      offset: 1,
      mutes: [],
      notes: [],
    };
    expect(actual).toEqual(expected);
  });

  test("parses full shorthand expression", () => {
    const actual = parseVoicing("o2 m1 m2 n3,3 n4,5 b5,6,5");
    const expected = {
      offset: 2,
      mutes: [{ string: 1 }, { string: 2 }],
      notes: [
        { string: 3, fret: 3 },
        { string: 4, fret: 5 },
      ],
      barres: [{ first: 5, last: 6, fret: 5 }],
    };
    expect(actual).toEqual(expected);
  });

  test("missing offset value throws error", () => {
    expect(() => parseVoicing("o")).toThrowError("takes exactly 1");
  });

  test("offset with 2 values throws error", () => {
    expect(() => parseVoicing("o1,2")).toThrowError("takes exactly 1");
  });

  test("missing mutes value throws error", () => {
    expect(() => parseVoicing("m")).toThrowError("takes exactly 1");
  });

  test("mutes with 2 values throws error", () => {
    expect(() => parseVoicing("m1,2")).toThrowError("takes exactly 1");
  });

  test("missing notes value throws error", () => {
    expect(() => parseVoicing("n")).toThrowError("takes exactly 2");
  });

  test("notes with 1 value throws error", () => {
    expect(() => parseVoicing("n1")).toThrowError("takes exactly 2");
  });

  test("missing barres value throws error", () => {
    expect(() => parseVoicing("b")).toThrowError("takes exactly 3");
  });

  test("barres with 2 values throws error", () => {
    expect(() => parseVoicing("b1,6")).toThrowError("takes exactly 3");
  });

  test("invalid rule type throws error", () => {
    expect(() => parseVoicing("a1")).toThrowError("Unknown rule");
  });

  test.each([
    ["", "o2"],
    ["", "m1"],
    ["", "n1,1"],
    ["", "b5,6,5"],
    ["o2", "o3"],
    ["m1", "m1 m2"],
    ["m1", "m1 n3,3"],
    ["m1", "b5,6,5"],
    ["m1 n3,3", "m1 n3,3 n4,3"],
    ["m1 n3,3", "b5,6,5"],
    ["b1,6,1", "b1,6,1 b5,6,3"],
    ["o1 m1 m2 n3,3 n4,5 b5,6,5", "o2 m1 m2 n3,3 n4,5 b5,6,5"],
  ])("%s is before %s", (v1, v2) => {
    const actual = compareVoicings(parseVoicing(v1), parseVoicing(v2));
    expect(actual).toBeLessThan(0);
  });

  test.each([
    ["o2", ""],
    ["m1", ""],
    ["n1,1", ""],
    ["b5,6,5", ""],
    ["o3", "o2"],
    ["m1 m2", "m1"],
    ["m1 n3,3", "m1"],
    ["b5,6,5", "m1"],
    ["m1 n3,3 n4,3", "m1 n3,3"],
    ["b5,6,5", "m1 n3,3"],
    ["b1,6,1 b5,6,3", "b1,6,1"],
    ["o2 m1 m2 n3,3 n4,5 b5,6,5", "o1 m1 m2 n3,3 n4,5 b5,6,5"],
  ])("%s is after %s", (v1, v2) => {
    const actual = compareVoicings(parseVoicing(v1), parseVoicing(v2));
    expect(actual).toBeGreaterThan(0);
  });
});
