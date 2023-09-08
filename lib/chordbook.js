"use strict";

const { parseVoicing, compareVoicings } = require("./voicing");
const { parseChord } = require("./chord");

const guitarChordbook = new Map();

function addGuitarChord(chord, shorthand) {
  chord.aliases().map((c) => {
    const name = c.toString();
    if (!guitarChordbook.has(name)) {
      guitarChordbook.set(name, []);
    }
    guitarChordbook.get(name).push(parseVoicing(shorthand));
    guitarChordbook.get(name).sort(compareVoicings);
  });
}

addGuitarChord(parseChord("N.C."), "m1 m2 m3 m4 m5 m6");

addGuitarChord(parseChord("C"), "m1 n2,3 n3,2 n5,1");
addGuitarChord(parseChord("Cm"), "m1 m2 n3,1 n5,1 n6,3");
addGuitarChord(parseChord("C6"), "n3,2 n4,2 n5,1 n6,3");
addGuitarChord(parseChord("C7"), "m1 n2,3 n3,2 n4,3 n5,1");
addGuitarChord(parseChord("Cm6"), "m1 n3,1 n5,1 n6,3");
addGuitarChord(parseChord("Caug"), "n2,3 n3,2 n4,1 n5,1");
addGuitarChord(parseChord("Cmaj7"), "n1,3 n2,3 n3,2");

addGuitarChord(parseChord("D"), "m1 m2 n4,2 n5,3 n6,2");
addGuitarChord(parseChord("D/F#"), "n1,2 n4,2 n5,3 n6,2");
addGuitarChord(parseChord("Dm"), "m1 m2 n4,2 n5,3 n6,1");
addGuitarChord(parseChord("D7"), "m1 m2 n4,2 n5,1 n6,2");
addGuitarChord(parseChord("Dm7"), "m1 m2 n4,2 n5,1 n6,1");
addGuitarChord(parseChord("Dsus4"), "m1 m2 n4,2 n5,3 n6,3");

addGuitarChord(parseChord("E"), "n2,2 n3,2 n4,1");
addGuitarChord(parseChord("Em"), "n2,2 n3,2");
addGuitarChord(parseChord("E7"), "n2,2 n3,2 n4,1");
addGuitarChord(parseChord("Em7"), "n2,2 n3,2 n5,3");

addGuitarChord(parseChord("G"), "n1,3 n2,2 n5,3 n6,3");
addGuitarChord(parseChord("G7"), "n1,3 n2,2 n6,1");
addGuitarChord(parseChord("Gmaj7"), "n1,3 m2 n6,2");

addGuitarChord(parseChord("A"), "m1 n3,2 n4,2 n5,2");
addGuitarChord(parseChord("Am"), "m1 n3,2 n4,2 n5,1");
addGuitarChord(parseChord("A7"), "m1 n3,2 n5,2");
addGuitarChord(parseChord("Am7"), "m1 n3,2 n5,1");

// E Shape Barre Chords
for (let os = 1; os < 17; os++) {
  addGuitarChord(
    parseChord("E").transpose(os),
    `o${os} b1,6,${os} n2,${2 + os} n3,${2 + os} n4,${1 + os}`,
  );
  addGuitarChord(
    parseChord("Em").transpose(os),
    `o${os} b1,6,${os} n2,${2 + os} n3,${2 + os}`,
  );
  addGuitarChord(
    parseChord("E7").transpose(os),
    `o${os} b1,6,${os} n2,${2 + os} n4,${1 + os} n5,${3 + os}`,
  );
  addGuitarChord(
    parseChord("E9").transpose(os),
    `o${os} b1,6,${os} n2,${2 + os} n4,${1 + os} n6,${2 + os}`,
  );
  addGuitarChord(
    parseChord("Em6").transpose(os),
    `o${os} b1,6,${os} n2,${2 + os} n3,${2 + os} n5,${2 + os}`,
  );
  addGuitarChord(
    parseChord("Em7").transpose(os),
    `o${os} b1,6,${os} n2,${2 + os}`,
  );
  addGuitarChord(
    parseChord("Edim").transpose(os),
    `o${os} b1,4,${os} n2,${1 + os} n3,${2 + os} m5 m6`,
  );
  addGuitarChord(
    parseChord("Edim7").transpose(os),
    `o${os} b1,6,${os} n2,${1 + os} n3,${2 + os} n5,${2 + os}`,
  );
  addGuitarChord(
    parseChord("Esus4").transpose(os),
    `o${os} b1,6,${os} n3,${2 + os} n4,${2 + os}`,
  );
  addGuitarChord(
    parseChord("E7sus4").transpose(os),
    `o${os} b1,6,${os} n2,${2 + os} n4,${2 + os}`,
  );
}

// A Shape Barre Chords
for (let os = 1; os < 17; os++) {
  addGuitarChord(
    parseChord("A").transpose(os),
    `o${os} b1,6,${os} n3,${2 + os} n4,${2 + os} n5,${2 + os}`,
  );
  addGuitarChord(
    parseChord("Am").transpose(os),
    `o${os} b1,6,${os} n3,${2 + os} n4,${2 + os} n5,${1 + os}`,
  );
  addGuitarChord(
    parseChord("A7").transpose(os),
    `o${os} b1,6,${os} n3,${2 + os} n5,${2 + os}`,
  );
  addGuitarChord(
    parseChord("Am7").transpose(os),
    `o${os} b1,6,${os} n3,${2 + os} n5,${1 + os}`,
  );
  addGuitarChord(
    parseChord("Amaj7").transpose(os),
    `o${os} b1,6,${os} n3,${2 + os} n4,${1 + os} n5,${2 + os}`,
  );
  addGuitarChord(
    parseChord("Amaj9").transpose(os),
    `o${os} b1,6,${os} n3,${2 + os} n4,${1 + os}`,
  );
  addGuitarChord(
    parseChord("Asus2").transpose(os),
    `o${os} b1,6,${os} n3,${2 + os} n4,${2 + os}`,
  );
  addGuitarChord(
    parseChord("Asus4").transpose(os),
    `o${os} b1,6,${os} n4,${2 + os} n5,${3 + os}`,
  );
  addGuitarChord(
    parseChord("A7sus2").transpose(os),
    `o${os} b1,5,${os} n3,${2 + os} n6,${3 + os}`,
  );
  addGuitarChord(
    parseChord("A7sus4").transpose(os),
    `o${os} b1,6,${os} n3,${2 + os} n5,${3 + os}`,
  );
}

// G Shape Barre Chords
for (let os = 1; os < 17; os++) {
  addGuitarChord(
    parseChord("G").transpose(os),
    `o${os} b3,5,${os} n1,${3 + os} n2,${2 + os} n6,${3 + os}`,
  );
  addGuitarChord(
    parseChord("G6").transpose(os),
    `o${os} b3,6,${os} n1,${3 + os} n2,${2 + os}`,
  );
  addGuitarChord(
    parseChord("G7").transpose(os),
    `o${os} m1 m2 b3,5,${os} n6,${1 + os}`,
  );
  addGuitarChord(
    parseChord("G9").transpose(os),
    `o${os} m1 b2,5,${os} n6,${1 + os}`,
  );
  addGuitarChord(
    parseChord("Gdim").transpose(os),
    `o${os} b1,6,${os} n2,${1 + os} n3,${2 + os} n5,${2 + os}`,
  );
  addGuitarChord(
    parseChord("Gadd9").transpose(os),
    `o${os} b2,5,${os} n1,${3 + os} n6,${3 + os}`,
  );
  addGuitarChord(
    parseChord("Gmaj7").transpose(os),
    `o${os} m1 b3,5,${os} n2,${2 + os} n6,${2 + os}`,
  );
}

module.exports = {
  guitarChordbook,
};
