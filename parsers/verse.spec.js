import { Chord } from "../lib/chord.js";
import { parseVoice, parsePhrase, parseVerse } from "./verse.js";

describe("Verse", () => {
  test("parses chord voice", () => {
    const voice = "c1:     Am    Bm    ";
    const actual = parseVoice(voice);
    expect(actual).toEqual([
      { index: 4, content: new Chord("A", "m") },
      { index: 10, content: new Chord("B", "m") },
    ]);
  });

  test("parses 2nd chord voice", () => {
    const voice = "c2:     Am    Bm    ";
    const actual = parseVoice(voice);
    expect(actual).toEqual([
      { index: 4, content: new Chord("A", "m") },
      { index: 10, content: new Chord("B", "m") },
    ]);
  });

  test("parses default chord voice", () => {
    const voice = "c:     Am    Bm    ";
    const actual = parseVoice(voice);
    expect(actual).toEqual([
      { index: 4, content: new Chord("A", "m") },
      { index: 10, content: new Chord("B", "m") },
    ]);
  });

  test("parses text voice", () => {
    const voice = "l1: All the leaves are brown";
    const actual = parseVoice(voice);
    expect(actual).toEqual([
      { index: 0, content: "All" },
      { index: 4, content: "the" },
      { index: 8, content: "leaves" },
      { index: 15, content: "are" },
      { index: 19, content: "brown" },
    ]);
  });

  test("throws error when voice line is invalid", () => {
    const voice = "1c:     Am    Bm    ";
    expect(() => parseVoice(voice)).toThrowError("Voice doesn't match");
  });

  test("parses chord and lyric line phrase", () => {
    const phrase = [
      "c1: G        Em                      Bm",
      "l1: I didn't ask, you shouldn't have told me",
    ].join("\n");
    const actual = parsePhrase(phrase);
    expect(actual).toEqual(
      expect.objectContaining(
        new Map([
          [
            "c1",
            [
              { index: 0, content: new Chord("G") },
              { index: 9, content: new Chord("E", "m") },
              { index: 33, content: new Chord("B", "m") },
            ],
          ],
          [
            "l1",
            [
              { index: 0, content: "I" },
              { index: 2, content: "didn't" },
              { index: 9, content: "ask," },
              { index: 14, content: "you" },
              { index: 18, content: "shouldn't" },
              { index: 28, content: "have" },
              { index: 33, content: "told" },
              { index: 38, content: "me" },
            ],
          ],
        ]),
      ),
    );
  });

  test("parses verse with two phrases", () => {
    const verse = [
      "c1:                    Am",
      "l1: All the leaves are brown",
      "",
      "c1: G  F          G      Esus2 E",
      "l1:       and the sky is gray.",
    ].join("\n");
    const actual = parseVerse(verse);
    expect(actual).toEqual(
      expect.objectContaining([
        new Map([
          ["c1", [{ index: 19, content: new Chord("A", "m") }]],
          [
            "l1",
            [
              { index: 0, content: "All" },
              { index: 4, content: "the" },
              { index: 8, content: "leaves" },
              { index: 15, content: "are" },
              { index: 19, content: "brown" },
            ],
          ],
        ]),
        new Map([
          [
            "c1",
            [
              { index: 0, content: new Chord("G") },
              { index: 3, content: new Chord("F") },
              { index: 14, content: new Chord("G") },
              { index: 21, content: new Chord("E", "sus2") },
              { index: 27, content: new Chord("E") },
            ],
          ],
          [
            "l1",
            [
              { index: 6, content: "and" },
              { index: 10, content: "the" },
              { index: 14, content: "sky" },
              { index: 18, content: "is" },
              { index: 21, content: "gray." },
            ],
          ],
        ]),
      ]),
    );
  });
});
