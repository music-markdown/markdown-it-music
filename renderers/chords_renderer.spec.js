"use strict";

const { parseChord } = require("../lib/chord");
const ChordsRenderer = require("./chords_renderer");

describe("Chords Renderer from Events", () => {
  test("should create a voice div", () => {
    const expectedVoiceDiv =
      `<div class="c1">` +
      `<span id="chord-0" class="chord"` +
      ` onmouseover="showPopper('chord-0', 'c')"` +
      ` onmouseout="hidePopper('c')">` +
      `C` +
      `</span>` +
      `</div>`;

    const voice = {
      index: 0,
      offset: 0,
      voice: "c1",
      content: parseChord("C"),
    };

    const chordsRenderer = new ChordsRenderer();
    chordsRenderer.voiceOrder = [["c1"]];
    const actualVoiceDiv = chordsRenderer.createVoiceDiv(voice);

    expect(actualVoiceDiv).toEqual(expectedVoiceDiv);
  });

  test("should create a line div", () => {
    const expectedLineDiv =
      `<div class="line">` +
      `<div class="event">` +
      `<div class="l1">Line</div>` +
      `</div>` +
      `<div class="event">` +
      `<div class="l1">Test</div>` +
      `</div>` +
      `</div>`;

    const line = [
      [{ index: 0, offset: 0, voice: "l1", content: "Line" }],
      [{ index: 0, offset: 0, voice: "l1", content: "Test" }],
    ];

    const chordsRenderer = new ChordsRenderer();
    chordsRenderer.voiceOrder = [["l1"]];
    const actualLineDiv = chordsRenderer.createLineDiv(line);

    expect(actualLineDiv).toEqual(expectedLineDiv);
  });

  test("should add diagram to chord div", () => {
    const line = [
      { index: 0, offset: 0, voice: "c1", content: parseChord("C") },
      { index: 0, offset: 0, voice: "l1", content: "Wonderful!" },
    ];

    const expectedEventDiv =
      `<div class="event">` +
      `<div class="c1">` +
      `<span id="chord-0" class="chord"` +
      ` onmouseover="showPopper('chord-0', 'c')"` +
      ` onmouseout="hidePopper('c')">` +
      `C` +
      `</span>` +
      `</div>` +
      `<div class="l1">Wonderful!</div>` +
      `</div>`;

    const chordsRenderer = new ChordsRenderer();
    chordsRenderer.voiceOrder = [["c1", "l1"]];
    const actualEventDiv = chordsRenderer.createEventDiv(line);

    expect(actualEventDiv).toEqual(expectedEventDiv);
  });

  test("should create a chart that contains two phrases that each contain two lines of events.", () => {
    const lines = [
      [
        [
          { index: 0, offset: 0, voice: "c1", content: parseChord("C") },
          { index: 0, offset: 0, voice: "l1", content: "Wonderful" },
        ],
        [
          { index: 0, offset: 0, voice: "c1", content: parseChord("G") },
          { index: 0, offset: 0, voice: "l1", content: "Testing!" },
        ],
      ],
      [
        [
          { index: 0, offset: 0, voice: "c1", content: parseChord("A") },
          { index: 0, offset: 0, voice: "l1", content: "Things" },
        ],
        [{ index: 10, offset: 1, voice: "l1", content: "IsGreat!" }],
      ],
    ];

    const chordsRenderer = new ChordsRenderer();
    chordsRenderer.voiceOrder = [
      ["c1", "l1"],
      ["c1", "l1"],
    ];
    const actualChartDiv = chordsRenderer.createEventHTMLChordChart(lines);

    const expectedEventDiv =
      `<div class="chart">` +
      `<div class="line">` +
      `<div class="event">` +
      `<div class="c1">` +
      `<span id="chord-0" class="chord"` +
      ` onmouseover="showPopper('chord-0', 'c')"` +
      ` onmouseout="hidePopper('c')">` +
      `C` +
      `</span>` +
      `</div>` +
      `<div class="l1">Wonderful</div>` +
      `</div>` +
      `<div class="event">` +
      `<div class="c1">` +
      `<span id="chord-1" class="chord"` +
      ` onmouseover="showPopper('chord-1', 'g')"` +
      ` onmouseout="hidePopper('g')">` +
      `G` +
      `</span>` +
      `</div>` +
      `<div class="l1">Testing!</div>` +
      `</div>` +
      `</div>` +
      `<div class="line">` +
      `<div class="event">` +
      `<div class="c1">` +
      `<span id="chord-2" class="chord"` +
      ` onmouseover="showPopper('chord-2', 'a')"` +
      ` onmouseout="hidePopper('a')">` +
      `A` +
      `</span>` +
      `</div>` +
      `<div class="l1">Things</div>` +
      `</div>` +
      `<div class="event">` +
      `<div> </div>` +
      `<div class="l1"> IsGreat!</div>` +
      `</div>` +
      `</div>` +
      `</div>`;

    expect(actualChartDiv).toEqual(expectedEventDiv);
  });

  test("should not add a space to a split event", () => {
    // This isn't actually a incredibly useful test any more since it all works off the offset.
    // Keeping it though since it's good to have a test help document functionality.
    const expectedLineDiv =
      '<div class="line">' +
      '<div class="event">' +
      `<div class="l1">Wonder</div>` +
      "</div>" +
      '<div class="event">' +
      `<div class="l1">-ful</div>` +
      "</div>" +
      "</div>";

    const line = [
      [{ index: 0, offset: 0, voice: "l1", content: "Wonder" }],
      [{ index: 0, offset: 0, voice: "l1", content: "-ful" }],
    ];

    const chordsRenderer = new ChordsRenderer();
    chordsRenderer.voiceOrder = [["l1"]];
    const actualLineDiv = chordsRenderer.createLineDiv(line);

    expect(actualLineDiv).toEqual(expectedLineDiv);
  });

  test("should add space before a voice if it does not start at the start index of an event", () => {
    const expectedLineDiv =
      `<div class="line">` +
      `<div class="event">` +
      `<div class="c1">  ` +
      `<span id="chord-0" class="chord"` +
      ` onmouseover="showPopper('chord-0', 'c')"` +
      ` onmouseout="hidePopper('c')">` +
      `C` +
      `</span>` +
      `</div>` +
      `<div class="l1">Testing!</div>` +
      `</div>` +
      `</div>`;

    const line = [
      [
        { index: 0, offset: 2, voice: "c1", content: parseChord("C") },
        { index: 0, offset: 0, voice: "l1", content: "Testing!" },
      ],
    ];

    const chordsRenderer = new ChordsRenderer();
    chordsRenderer.voiceOrder = [["c1", "l1"]];
    const actualLineDiv = chordsRenderer.createLineDiv(line);

    expect(actualLineDiv).toEqual(expectedLineDiv);
  });

  test("should render all phrases that have a different set of voices than the first", () => {
    const expectedChartDiv =
      `<div class="chart">` +
      `<div class="line">` +
      `<div class="event">` +
      `<div class="l1">Testing!</div>` +
      `</div>` +
      `</div>` +
      `<div class="line">` +
      `<div class="event">` +
      `<div class="c1">` +
      `<span id="chord-0" class="chord"` +
      ` onmouseover="showPopper('chord-0', 'c')"` +
      ` onmouseout="hidePopper('c')">` +
      `C` +
      `</span>` +
      `</div>` +
      `<div class="l1">Testing!</div>` +
      `</div>` +
      `</div>` +
      `</div>`;

    const lines = [
      [[{ index: 0, offset: 0, voice: "l1", content: "Testing!" }]],
      [
        [
          { index: 0, offset: 0, voice: "c1", content: parseChord("C") },
          { index: 0, offset: 0, voice: "l1", content: "Testing!" },
        ],
      ],
    ];

    const chordsRenderer = new ChordsRenderer();
    chordsRenderer.voiceOrder = [["l1"], ["c1", "l1"]];
    const actualChartDiv = chordsRenderer.createEventHTMLChordChart(lines);

    expect(actualChartDiv).toEqual(expectedChartDiv);
  });
});
