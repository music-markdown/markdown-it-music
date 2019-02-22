'use strict';

const Chord = require('../parsers/chord.js');

const rewire = require('rewire');
const chordsrendererjs = rewire('./chords_renderer.js');
chordsrendererjs.__set__('document', document);

const createHtmlChordChart = chordsrendererjs.__get__('createHtmlChordChart');
const createListOfWrappedVoices = chordsrendererjs.__get__('createListOfWrappedVoices');
const appendVoiceContentDiv = chordsrendererjs.__get__('appendVoiceContentDiv');

describe('JSON to HTML converter', () => {
  test('should wrap voice in div', () => {
    const parentDiv = document.createElement('div');
    appendVoiceContentDiv(parentDiv, 'The', 1);

    const expectedDiv = '<div><div> </div><div>The</div></div>';

    expect(parentDiv.outerHTML).toEqual(expectedDiv);
  });

  test('should not include spaces div if there is no expected whitespace', () => {
    const parentDiv = document.createElement('div');
    appendVoiceContentDiv(parentDiv, new Chord('C'), 0);

    const expectedDiv = '<div><div>C</div></div>';

    expect(parentDiv.outerHTML).toEqual(expectedDiv);
  });

  test('should append several chords to same parent div', () => {
    const parentDiv = document.createElement('div');
    appendVoiceContentDiv(parentDiv, new Chord('C'), 0);
    appendVoiceContentDiv(parentDiv, new Chord('G'), 5);

    const expectedDiv = '<div><div>C</div><div>     </div><div>G</div></div>';

    expect(parentDiv.outerHTML).toEqual(expectedDiv);
  });

  test('should convert a list of voice events (a chord chard) to wrapped divs', () => {
    const chordChartJson = new Map([
      ['c1', [
        { index: 4, content: new Chord('G') },
        { index: 12, content: new Chord('F') },
        { index: 20, content: new Chord('Am') },
        { index: 29, content: new Chord('G') },
        { index: 40, content: new Chord('F') },
        { index: 47, content: new Chord('C') },
      ]],
      ['c2', [
        { index: 4, content: new Chord('C') },
        { index: 12, content: new Chord('D') },
        { index: 20, content: new Chord('Cm') },
        { index: 29, content: new Chord('F') },
        { index: 40, content: new Chord('G') },
        { index: 47, content: new Chord('B') },
      ]],
      ['l1', [
        { index: 0, content: 'The' },
        { index: 4, content: 'longest' },
        { index: 12, content: 'word' },
        { index: 17, content: 'is' },
        { index: 20, content: 'supercalifragilisticexpialidocious' },
      ]],
      ['l2', [
        { index: 40, content: 'supercalifragilisticexpialidocious' },
      ]],
      ['a1', [
        { index: 4, content: 'crash!' },
      ]]
    ]);

    const expectedChordChartHtmlList = [
      '<div class="c1">' +
        '<div>    </div><div>G</div>' +
        '<div>       </div><div>F</div>' +
        '<div>       </div><div>Am</div>' +
        '<div>       </div><div>G</div>' +
        '<div>          </div><div>F</div>' +
        '<div>      </div><div>C</div>' +
      '</div>',

      '<div class="c2">' +
        '<div>    </div><div>C</div>' +
        '<div>       </div><div>D</div>' +
        '<div>       </div><div>Cm</div>' +
        '<div>       </div><div>F</div>' +
        '<div>          </div><div>G</div>' +
        '<div>      </div><div>B</div>' +
      '</div>',

      '<div class="l1">' +
        '<div>The</div>' +
        '<div> </div><div>longest</div>' +
        '<div> </div><div>word</div>' +
        '<div> </div><div>is</div>' +
        '<div> </div><div>supercalifragilisticexpialidocious</div>' +
      '</div>',

      '<div class="l2">' +
        '<div>                                        </div><div>supercalifragilisticexpialidocious</div></div>',
      '<div class="a1">' +
        '<div>    </div><div>crash!</div>' +
      '</div>'
    ];

    const actualHtmlList = createListOfWrappedVoices(chordChartJson)
      .map((html) => {
        return html.outerHTML;
      });

    expect(actualHtmlList).toEqual(expectedChordChartHtmlList);
  });

  test('should wrap a chord chart in chord chart class div', () => {
    const shortChart = [
      new Map([['l1', [{ index: 0, content: 'short' }]]])
    ];

    const expectedChordChartHtml = '<div class="chart">' +
      '<div class="verse">' +
        '<div class="l1">' +
        '<div>short</div>' +
      '</div></div></div>';

    expect(createHtmlChordChart(shortChart).outerHTML).toEqual(expectedChordChartHtml);
  });

  test('should separate each verse into their own wrapped div', () => {
    const verse = [
      new Map([
        ['c1', [
          { index: 0, content: new Chord('C') },
          { index: 4, content: new Chord('G') },
        ]],
        ['l1', [
          { index: 0, content: 'Test' }
        ]]
      ]),
      new Map([
        ['c1', [
          { index: 0, content: new Chord('A') },
        ]],
        ['l1', [
          { index: 0, content: 'Song' }
        ]]
      ])
    ];

    const expectedDiv =
      '<div class="chart">' +
        '<div class="verse">' +
          '<div class="c1">' +
            '<div>C</div>' +
            '<div>   </div><div>G</div>' +
          '</div>' +
          '<div class="l1">' +
            '<div>Test</div>' +
          '</div>' +
        '</div>' +
        '<div class="verse">' +
          '<div class="c1">' +
            '<div>A</div>' +
          '</div>' +
          '<div class="l1">' +
            '<div>Song</div>' +
          '</div>' +
        '</div>' +
      '</div>';

    expect(createHtmlChordChart(verse).outerHTML).toEqual(expectedDiv);
  });
});
