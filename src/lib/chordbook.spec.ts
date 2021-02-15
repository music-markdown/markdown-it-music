import { parseVoicing } from "./voicing";
import { guitarChordbook } from "./chordbook";

describe("Guitar Chordbook", () => {
  test.each([
    ["F", 1],
    ["F#", 2],
    ["Gb", 2],
    ["G", 3],
    ["G#", 4],
    ["Ab", 4],
    ["A", 5],
    ["A#", 6],
    ["Bb", 6],
    ["B", 7],
    ["C", 8],
    ["C#", 9],
    ["Db", 9],
    ["D", 10],
    ["D#", 11],
    ["Eb", 11],
    ["E", 12],
    ["F", 13],
    ["F#", 14],
    ["Gb", 14],
    ["G", 15],
    ["G#", 16],
    ["Ab", 16],
  ])(
    "should contain %s barre chord as E shaped chord offset by %s",
    (name, os) => {
      expect(guitarChordbook.get(name)).toContainEqual(
        parseVoicing(`o${os} b1,6,${os} n2,${2 + os} n3,${2 + os} n4,${1 + os}`)
      );
    }
  );

  test.each([
    ["A#", 1],
    ["Bb", 1],
    ["B", 2],
    ["C", 3],
    ["C#", 4],
    ["Db", 4],
    ["D", 5],
    ["D#", 6],
    ["Eb", 6],
    ["E", 7],
    ["F", 8],
    ["F#", 9],
    ["Gb", 9],
    ["G", 10],
    ["G#", 11],
    ["Ab", 11],
    ["A", 12],
    ["A#", 13],
    ["Bb", 13],
    ["B", 14],
    ["C", 15],
    ["C#", 16],
    ["Db", 16],
  ])(
    "should contain %s barre chord as A shaped chord offset by %s",
    (name, os) => {
      expect(guitarChordbook.get(name)).toContainEqual(
        parseVoicing(`o${os} b1,6,${os} n3,${2 + os} n4,${2 + os} n5,${2 + os}`)
      );
    }
  );

  test.each([
    ["G#", 1],
    ["Ab", 1],
    ["A", 2],
    ["A#", 3],
    ["Bb", 3],
    ["B", 4],
    ["C", 5],
    ["C#", 6],
    ["Db", 6],
    ["D", 7],
    ["D#", 8],
    ["Eb", 8],
    ["E", 9],
    ["F", 10],
    ["F#", 11],
    ["Gb", 11],
    ["G", 12],
    ["G#", 13],
    ["Ab", 13],
    ["A", 14],
    ["A#", 15],
    ["Bb", 15],
    ["B", 16],
  ])(
    "should contain %s barre chord as G shaped chord offset by %s",
    (name, os) => {
      expect(guitarChordbook.get(name)).toContainEqual(
        parseVoicing(`o${os} b3,5,${os} n1,${3 + os} n2,${2 + os} n6,${3 + os}`)
      );
    }
  );

  test.each([
    ["D", "m1 m2 n4,2 n5,3 n6,2"],
    ["D", "o5 b1,6,5 n3,7 n4,7 n5,7"],
    ["D", "o7 b3,5,7 n1,10 n2,9 n6,10"],
    ["D", "o10 b1,6,10 n2,12 n3,12 n4,11"],
    // E shape chords
    ["F", "o1 b1,6,1 n2,3 n3,3 n4,2"],
    ["Fm", "o1 b1,6,1 n2,3 n3,3"],
    ["F7", "o1 b1,6,1 n2,3 n4,2 n5,4"],
    ["F9", "o1 b1,6,1 n2,3 n4,2 n6,3"],
    ["Fm6", "o1 b1,6,1 n2,3 n3,3 n5,3"],
    ["Fm7", "o1 b1,6,1 n2,3"],
    ["Fdim", "o1 b1,4,1 n2,2 n3,3 m5 m6"],
    ["Fdim7", "o1 b1,6,1 n2,2 n3,3 n5,3"],
    ["Fsus4", "o1 b1,6,1 n3,3 n4,3"],
    ["F7sus4", "o1 b1,6,1 n2,3 n4,3"],
    // A shape chords
    ["Bb", "o1 b1,6,1 n3,3 n4,3 n5,3"],
    ["Bbm", "o1 b1,6,1 n3,3 n4,3 n5,2"],
    ["Bb7", "o1 b1,6,1 n3,3 n5,3"],
    ["Bbm7", "o1 b1,6,1 n3,3 n5,2"],
    ["Bbmaj7", "o1 b1,6,1 n3,3 n4,2 n5,3"],
    ["Bbmaj9", "o1 b1,6,1 n3,3 n4,2"],
    ["Bbsus2", "o1 b1,6,1 n3,3 n4,3"],
    ["Bbsus4", "o1 b1,6,1 n4,3 n5,4"],
    ["Bb7sus2", "o1 b1,5,1 n3,3 n6,4"],
    ["Bb7sus4", "o1 b1,6,1 n3,3 n5,4"],
    // G shape chords
    ["Ab", "o1 b3,5,1 n1,4 n2,3 n6,4"],
    ["Ab6", "o1 b3,6,1 n1,4 n2,3"],
    ["Ab7", "o1 b3,5,1 m1 m2 n6,2"],
    ["Ab9", "o1 b2,5,1 m1 n6,2"],
    ["Abdim", "o1 b1,6,1 n2,2 n3,3 n5,3"],
    ["Abadd9", "o1 b2,5,1 n1,4 n6,4"],
    ["Abmaj7", "o1 b3,5,1 m1 n2,3 n6,3"],
  ])("should contain %s chord voicing %s", (name, voicing) => {
    expect(guitarChordbook.get(name)).toContainEqual(parseVoicing(voicing));
  });
});
