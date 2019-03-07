'use strict';

const rewire = require('rewire');

const chordsRendererFromEventsJs = rewire('./chords_renderer_from_events.js');
chordsRendererFromEventsJs.__set__('document', document);

const mockAddChordToDivFn = jest.fn(() => 'svg_here');
chordsRendererFromEventsJs.__get__('chordHover').addChordToDiv = mockAddChordToDivFn;

const ChordsEventRenderer = chordsRendererFromEventsJs.__get__('ChordsEventRenderer');

describe('Chords Renderer from Events', () => {
  const defaultColors = ['black', 'blue', 'red', 'green', 'purple', 'teal'];
  let voiceColors;

  beforeEach(() => {
    mockAddChordToDivFn.mockClear();
    voiceColors = ['black', 'blue', 'red', 'green', 'purple', 'teal'];
  });

  test('should create a voice div', () => {
    const expectedVoiceDiv =
      `<div style="color: ${defaultColors[0]};">` +
        `<div class="c1"> C</div>` +
      `</div>`;

    const voice = { index: 0, offset: 1, voice: 'c1', content: 'C' };

    const chordsRenderer = new ChordsEventRenderer(['c1'], voiceColors);
    const actualVoiceDiv = chordsRenderer.createVoiceDiv(voice);

    expect(actualVoiceDiv.outerHTML).toEqual(expectedVoiceDiv);
    expect(mockAddChordToDivFn).toHaveBeenCalledTimes(1);
  });

  test('should create a line div', () => {
    const expectedLineDiv = '<div class="line">' +
      '<div class="event">' +
        `<div style="color: ${defaultColors[0]};">` +
          `<div class="l1"> Line</div>` +
        `</div>` +
      '</div>' +
      '<div class="event">' +
        `<div style="color: ${defaultColors[0]};">` +
          `<div class="l1"> Test</div>` +
        `</div>` +
      '</div>' +
    '</div>';

    const line = [
      [
        { index: 0, offset: 1, voice: 'l1', content: 'Line' },
      ],
      [
        { index: 0, offset: 1, voice: 'l1', content: 'Test' },
      ]
    ];

    const chordsRenderer = new ChordsEventRenderer(['l1'], voiceColors);
    const actualLineDiv = chordsRenderer.createLineDiv(line);

    expect(actualLineDiv.outerHTML).toEqual(expectedLineDiv);
  });

  test('should add diagram to chord div', () => {
    const line = [
      { index: 0, offset: 1, voice: 'c1', content: 'C' },
      { index: 0, offset: 1, voice: 'l1', content: 'Wonderful!' },
    ];

    const expectedEventDiv = '<div class="event">' +
      `<div style="color: ${defaultColors[0]};">` +
        `<div class="c1"> C</div>` +
      `</div>` +
      `<div style="color: ${defaultColors[1]};">` +
        `<div class="l1"> Wonderful!</div>` +
      `</div>` +
    '</div>';

    const chordsRenderer = new ChordsEventRenderer(['c1', 'l1'], voiceColors,);
    const actualEventDiv = chordsRenderer.createEventDiv(line);

    expect(actualEventDiv.outerHTML).toEqual(expectedEventDiv);
    expect(mockAddChordToDivFn).toHaveBeenCalledTimes(1);
  });

  test('should create a chart that contains two phrases that each contain two lines of events.', () => {
    const lines = [[
      [
        { index: 0, offset: 1, voice: 'c1', content: 'C' },
        { index: 0, offset: 1, voice: 'l1', content: 'Wonderful' },
      ],
      [
        { index: 0, offset: 1, voice: 'c1', content: 'G' },
        { index: 0, offset: 1, voice: 'l1', content: 'Testing!' },
      ]
    ],
    [
      [
        { index: 0, offset: 1, voice: 'c1', content: 'A' },
        { index: 0, offset: 1, voice: 'l1', content: 'Things' },
      ],
      [
        { index: 10, offset: 1, voice: 'l1', content: 'IsGreat!' },
      ]
    ]];

    const chordsRenderer = new ChordsEventRenderer(['c1', 'l1'], voiceColors);
    const actualChartDiv = chordsRenderer.createEventHTMLChordChart(lines);

    const expectedEventDiv = '<div class="chart">' +
      '<div class="line">' +
        '<div class="event">' +
          `<div style="color: ${defaultColors[0]};">` +
            `<div class="c1"> C</div>` +
          `</div>` +
          `<div style="color: ${defaultColors[1]};">` +
            `<div class="l1"> Wonderful</div>` +
          `</div>` +
        '</div>' +
        '<div class="event">' +
          `<div style="color: ${defaultColors[0]};">` +
            `<div class="c1"> G</div>` +
          `</div>` +
          `<div style="color: ${defaultColors[1]};">` +
            `<div class="l1"> Testing!</div>` +
          `</div>` +
        '</div>' +
      '</div>' +
      '<div class="line">' +
        '<div class="event">' +
          `<div style="color: ${defaultColors[0]};">` +
            `<div class="c1"> A</div>` +
          `</div>` +
          `<div style="color: ${defaultColors[1]};">` +
            `<div class="l1"> Things</div>` +
          `</div>` +
        '</div>' +
        '<div class="event">' +
          `<div> </div>` +
          `<div style="color: ${defaultColors[1]};">` +
            `<div class="l1"> IsGreat!</div>` +
          `</div>` +
        '</div>' +
      '</div>' +
    '</div>';

    expect(actualChartDiv.outerHTML).toEqual(expectedEventDiv);
    expect(mockAddChordToDivFn).toHaveBeenCalledTimes(3);
  });

  test('should not add a space to a split event', () => {
    // This isn't actually a incredibly useful test any more since it all works off the offset.
    // Keeping it though since it's good to have a test help document functionality.
    const expectedLineDiv ='<div class="line">' +
      '<div class="event">' +
        `<div style="color: ${defaultColors[0]};">` +
          `<div class="l1"> Wonder</div>` +
        `</div>` +
      '</div>' +
      '<div class="event">' +
        `<div style="color: ${defaultColors[0]};">` +
          `<div class="l1">-ful</div>` +
        `</div>` +
      '</div>' +
    '</div>';

    const line = [
      [
        { index: 0, offset: 1, voice: 'l1', content: 'Wonder' },
      ],
      [
        { index: 0, offset: 0, voice: 'l1', content: '-ful' },
      ]
    ];

    const chordsRenderer = new ChordsEventRenderer(['l1'], voiceColors);
    const actualLineDiv = chordsRenderer.createLineDiv(line);

    expect(actualLineDiv.outerHTML).toEqual(expectedLineDiv);
  });

  test('should add space before a voice if it does not start at the start index of an event', () => {
    const expectedLineDiv ='<div class="line">' +
      '<div class="event">' +
        `<div style="color: ${defaultColors[0]};">` +
          `<div class="c1">   C</div>` +
        `</div>` +
        `<div style="color: ${defaultColors[1]};">` +
          `<div class="l1"> Testing!</div>` +
        `</div>` +
      '</div>' +
    '</div>';

    const line = [
      [
        { index: 0, offset: 3, voice: 'c1', content: 'C' },
        { index: 0, offset: 1, voice: 'l1', content: 'Testing!' },
      ]
    ];

    const chordsRenderer = new ChordsEventRenderer(['c1', 'l1'], voiceColors);
    const actualLineDiv = chordsRenderer.createLineDiv(line);

    expect(actualLineDiv.outerHTML).toEqual(expectedLineDiv);
    expect(mockAddChordToDivFn).toHaveBeenCalledTimes(1);
  });
});
