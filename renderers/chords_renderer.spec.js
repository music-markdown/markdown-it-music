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
    const chordChartJson = [
      { index: 4, voice: 'c1', content: new Chord('G') },
      { index: 12, voice: 'c1', content: new Chord('F') },
      { index: 20, voice: 'c1', content: new Chord('Am') },
      { index: 29, voice: 'c1', content: new Chord('G') },
      { index: 40, voice: 'c1', content: new Chord('F') },
      { index: 47, voice: 'c1', content: new Chord('C') },
      { index: 4, voice: 'c2', content: new Chord('C') },
      { index: 12, voice: 'c2', content: new Chord('D') },
      { index: 20, voice: 'c2', content: new Chord('Cm') },
      { index: 29, voice: 'c2', content: new Chord('F') },
      { index: 40, voice: 'c2', content: new Chord('G') },
      { index: 47, voice: 'c2', content: new Chord('B') },
      { index: 0, voice: 'l1', content: 'The' },
      { index: 4, voice: 'l1', content: 'longest' },
      { index: 12, voice: 'l1', content: 'word' },
      { index: 17, voice: 'l1', content: 'is' },
      { index: 20, voice: 'l1', content: 'supercalifragilisticexpialidocious' },
      { index: 40, voice: 'l2', content: 'supercalifragilisticexpialidocious' },
      { index: 4, voice: 'a1', content: 'crash!' },
    ];

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
    const shortChart = [[
      { index: 0, voice: 'l1', content: 'short' }
    ]];

    const expectedChordChartHtml = '<div class="chart">' +
      '<div class="verse">' +
        '<div class="l1">' +
        '<div>short</div>' +
      '</div></div></div>';

    expect(createHtmlChordChart(shortChart).outerHTML).toEqual(expectedChordChartHtml);
  });

  test('should separate each verse into their own wrapped div', () => {
    const verse = [
      [
        { index: 0, voice: 'c1', content: new Chord('C') },
        { index: 4, voice: 'c1', content: new Chord('G') },
        { index: 0, voice: 'l1', content: 'Test' }
      ],
      [
        { index: 0, voice: 'c1', content: new Chord('A') },
        { index: 0, voice: 'l1', content: 'Song' }
      ]
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
