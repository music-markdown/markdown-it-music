'use strict';

const Chord = require('../instruments/chord');
const ChordsRenderer = require('./chords_renderer')['ChordsRenderer'];

describe('JSON to HTML converter', () => {
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

  test('should wrap voice in div', () => {
    const chordChartRenderer = new ChordsRenderer();

    const parentDiv = document.createElement('div');
    chordChartRenderer.appendVoiceContentDiv(parentDiv, 'The', 1);

    const expectedDiv = '<div><div> </div><div>The</div></div>';

    expect(parentDiv.outerHTML).toEqual(expectedDiv);
  });

  test('should not include spaces div if there is no expected whitespace', () => {
    const chordChartRenderer = new ChordsRenderer();

    const parentDiv = document.createElement('div');
    chordChartRenderer.appendVoiceContentDiv(parentDiv, new Chord('C'), 0);

    const expectedDiv = '<div><div>C</div></div>';

    expect(parentDiv.outerHTML).toEqual(expectedDiv);
  });

  test('should append several chords to same parent div', () => {
    const chordChartRenderer = new ChordsRenderer();

    const parentDiv = document.createElement('div');
    chordChartRenderer.appendVoiceContentDiv(parentDiv, new Chord('C'), 0);
    chordChartRenderer.appendVoiceContentDiv(parentDiv, new Chord('G'), 5);

    const expectedDiv = '<div><div>C</div><div>     </div><div>G</div></div>';

    expect(parentDiv.outerHTML).toEqual(expectedDiv);
  });

  test('should convert a list of voice events (a chord chard) to wrapped divs', () => {
    const chordChartRenderer = new ChordsRenderer(chordChartJson);

    const expectedChordChartHtmlList = [
      '<div class="c1"><div>    </div><div>G</div><div>       </div><div>F</div><div>       </div><div>Am</div><div>       </div><div>G</div><div>          </div><div>F</div><div>      </div><div>C</div></div>',
      '<div class="c2"><div>    </div><div>C</div><div>       </div><div>D</div><div>       </div><div>Cm</div><div>       </div><div>F</div><div>          </div><div>G</div><div>      </div><div>B</div></div>',
      '<div class="l1"><div>The</div><div> </div><div>longest</div><div> </div><div>word</div><div> </div><div>is</div><div> </div><div>supercalifragilisticexpialidocious</div></div>',
      '<div class="l2"><div>                                        </div><div>supercalifragilisticexpialidocious</div></div>',
      '<div class="a1"><div>    </div><div>crash!</div></div>'
    ];

    const actualHtmlList = chordChartRenderer.createListOfWrappedVoices()
      .map((html) => {
        return html.outerHTML;
      });

    expect(actualHtmlList).toEqual(expectedChordChartHtmlList);
  });

  // test('should wrap a chord chart in chord chart class div', () => {
  //   const shortChart = [
  //     { index: 0, voice: 'l1', content: 'short' }
  //   ];

  //   const chordChartRenderer = new ChordsRenderer(shortChart);

  //   const expectedChordChartHtml = document.createElement('div');
  //   expectedChordChartHtml.className = 'chart';

  //   const voiceDiv = document.createElement('div');
  //   voiceDiv.innerHTML = 'short';

  //   const eventDiv = document.createElement('div');
  //   eventDiv.className = 'l1';
  //   eventDiv.appendChild(voiceDiv);

  //   expectedChordChartHtml.appendChild(eventDiv);

  //   expect(chordChartRenderer.createHtmlChordChart()).toEqual(expectedChordChartHtml);
  // });
});