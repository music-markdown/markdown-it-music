'use strict';

const rewire = require('rewire');
const { Chord } = require('../lib/chord');
const eventsjs = rewire('./events');

const convertVerseToEvents = eventsjs.__get__('convertVerseToEvents');
const Line = eventsjs.__get__('Line');

describe('Event', () => {
  test('should add voices', () => {
    const expectedLine = [
      { index: 4, offset: 0, voice: 'c1', content: 'G' },
      { index: 4, offset: 0, voice: 'c2', content: 'C' },
      { index: 4, offset: 0, voice: 'l1', content: 'longest' },
      { index: 4, offset: 0, voice: 'a1', content: 'crash!' },
    ];

    const nextVoices = new Map([[
      'c1', [
        { index: 4, content: 'G' },
      ]], [
      'c2', [
        { index: 4, content: 'C' },
      ]], [
      'l1', [
        { index: 4, content: 'longest' },
      ]], [
      'a1', [
        { index: 4, content: 'crash!' },
      ]]
    ]);

    const line = new Line();
    const actualLine = line.createLineFromPhrase(nextVoices, ['c1', 'c2', 'l1', 'a1']);

    expect(actualLine).toEqual(expectedLine);
  });

  test('should only add voices that are in index range', () => {
    const phrase = new Map([[
      'c1', [
        { index: 4, content: 'G' },
      ]], [
      'c2', [
        { index: 4, content: 'C' },
      ]], [
      'l1', [
        { index: 0, content: 'The' },
      ]], [
      'l2', [
        { index: 0, content: 'Test' },
      ]]
    ]);

    const expectedLine = [
      { index: 0, offset: 0, voice: 'l1', content: 'The' },
      { index: 0, offset: 0, voice: 'l2', content: 'Test' }
    ];

    const line = new Line();
    const actualLine = line.createLineFromPhrase(phrase, ['c1', 'c2', 'l1', 'l2']);

    expect(actualLine).toEqual(expectedLine);
  });

  test('should add next index first', () => {
    const phrase = new Map([[
      'c1', [
        { index: 0, content: 'G' },
      ]], [
      'c2', [
        { index: 40, content: 'C' },
      ]], [
      'l1', [
        { index: 0, content: 'The' },
      ]], [
      'l2', [
        { index: 40, content: 'Test' },
      ]]
    ]);

    const expectedLine = [
      { index: 0, offset: 0, voice: 'c1', content: 'G' },
      { index: 0, offset: 0, voice: 'l1', content: 'The' }
    ];

    const line = new Line();
    const actualLine = line.createLineFromPhrase(phrase, ['c1', 'c2', 'l1', 'l2']);

    expect(actualLine).toEqual(expectedLine);
  });

  test('should transform a verse into a list of events', () => {
    const verse = [
      new Map([[
        'c1', [
          { index: 19, content: new Chord('A', 'm') },
        ]], [
        'l1', [
          { index: 0, content: 'All' },
          { index: 4, content: 'the' },
          { index: 8, content: 'leaves' },
          { index: 15, content: 'are' },
          { index: 19, content: 'brown' },
        ]]
      ]),
      new Map([[
        'c1', [
          { index: 0, content: new Chord('G') },
          { index: 3, content: new Chord('F') },
          { index: 14, content: new Chord('G') },
          { index: 21, content: new Chord('E', 'sus2') },
          { index: 27, content: new Chord('E') },
        ]], [
        'l1', [
          { index: 6, content: 'and' },
          { index: 10, content: 'the' },
          { index: 14, content: 'sky' },
          { index: 18, content: 'is' },
          { index: 21, content: 'gray.' },
        ]]
      ])
    ];

    const expectedLines = [
      [
        [{ index: 0, offset: 0, voice: 'l1', content: 'All' }],
        [{ index: 4, offset: 1, voice: 'l1', content: 'the' }],
        [{ index: 8, offset: 1, voice: 'l1', content: 'leaves' }],
        [{ index: 15, offset: 1, voice: 'l1', content: 'are' }],
        [
          { index: 19, offset: 1, voice: 'c1', content: new Chord('A', 'm') },
          { index: 19, offset: 1, voice: 'l1', content: 'brown' },
        ]
      ],
      [
        [{ index: 0, offset: 0, voice: 'c1', content: new Chord('G') }],
        [{ index: 3, offset: 1, voice: 'c1', content: new Chord('F') }],
        [{ index: 6, offset: 1, voice: 'l1', content: 'and' }],
        [{ index: 10, offset: 1, voice: 'l1', content: 'the' }],
        [
          { index: 14, offset: 1, voice: 'c1', content: new Chord('G') },
          { index: 14, offset: 1, voice: 'l1', content: 'sky' },
        ],
        [{ index: 18, offset: 1, voice: 'l1', content: 'is' }],
        [
          { index: 21, offset: 1, voice: 'c1', content: new Chord('E', 'sus2') },
          { index: 21, offset: 1, voice: 'l1', content: 'gray.' },
        ],
        [{ index: 27, offset: 1, voice: 'c1', content: new Chord('E') }]
      ]
    ];

    const actualLines = convertVerseToEvents(verse);
    expect(actualLines).toEqual(expectedLines);
  });

  test('should split a previous event if there is overlap', () => {
    const verse = [
      new Map([[
        'c1', [
          { index: 0, content: new Chord('A') },
          { index: 11, content: new Chord('C') },
          { index: 20, content: new Chord('D') },
          { index: 31, content: new Chord('E') },
        ]], [
        'l1', [
          { index: 0, content: 'longest' },
          { index: 8, content: 'is' },
          { index: 11, content: 'supercalifragilisticexpialidocious' }
        ]]
      ])
    ];

    const expectedLines = [
      [
        [
          { index: 0, offset: 0, voice: 'c1', content: new Chord('A') },
          { index: 0, offset: 0, voice: 'l1', content: 'longest' },
        ],
        [
          { index: 8, offset: 1, voice: 'l1', content: 'is' },
        ],
        [
          { index: 11, offset: 1, voice: 'c1', content: new Chord('C') },
          { index: 11, offset: 1, voice: 'l1', content: 'supercali' }
        ],
        [
          { index: 20, offset: 1, voice: 'c1', content: new Chord('D') },
          { index: 20, offset: 0, voice: 'l1', content: '-fragilistic' }
        ],
        [
          { index: 31, offset: 1, voice: 'c1', content: new Chord('E') },
          { index: 31, offset: 0, voice: 'l1', content: '-expialidocious' }
        ],
      ]
    ];

    const actualLines = convertVerseToEvents(verse);

    expect(actualLines).toEqual(expectedLines);
  });

  test('should split all previous events when long events exist in different phrases', () => {
    const verse = [
      new Map([[
        'c1', [
          { index: 0, content: new Chord('Am') },
          { index: 6, content: new Chord('C') },
        ]], [
        'l1', [
          { index: 0, content: 'Wonderful' }
        ]]
      ]),
      new Map([[
        'c1', [
          { index: 0, content: new Chord('Am') },
          { index: 4, content: new Chord('C') },
        ]], [
        'l1', [
          { index: 0, content: 'Testing' }
        ]]
      ]),
    ];

    const expectedLines = [
      [
        [
          { index: 0, offset: 0, voice: 'c1', content: new Chord('Am') },
          { index: 0, offset: 0, voice: 'l1', content: 'Wonder' }
        ],
        [
          { index: 6, offset: 1, voice: 'c1', content: new Chord('C') },
          { index: 6, offset: 0, voice: 'l1', content: '-ful' }
        ]
      ],
      [
        [
          { index: 0, offset: 0, voice: 'c1', content: new Chord('Am') },
          { index: 0, offset: 0, voice: 'l1', content: 'Test' }
        ],
        [
          { index: 4, offset: 1, voice: 'c1', content: new Chord('C') },
          { index: 4, offset: 0, voice: 'l1', content: '-ing' }
        ]
      ]
    ];

    const actualLines = convertVerseToEvents(verse);

    expect(actualLines).toEqual(expectedLines);
  });

  test('should include offset when a voice is not at the start index of an event', () => {
    const phrase = new Map([[
      'c1', [
        { index: 2, content: new Chord('C') }
      ]], [
      'l1', [
        { index: 0, content: 'Testing' }
      ]]
    ]);

    const line = new Line();
    const actualLine = line.createLineFromPhrase(phrase, ['c1', 'l1']);

    const expectedLine = [
      { index: 2, voice: 'c1', content: new Chord('C'), offset: 2 },
      { index: 0, voice: 'l1', content: 'Testing', offset: 0 }
    ];

    expect(actualLine).toEqual(expectedLine);
  });

  test('should not add a voice if the next event would occur before the voice', () => {
    const verse = [new Map([[
      'c1', [
        { index: 19, content: new Chord('Am') }
      ]], [
      'v1', [
        { index: 0, content: 'All' },
        { index: 4, content: 'the' },
        { index: 8, content: 'leaves' },
        { index: 15, content: 'are' },
        { index: 19, content: 'brown' }
      ]], [
      'v2', [
        { index: 0, content: '!!!!!!!!!!!!!!!!!!!!!' }
      ]
    ]])];

    const actualLines = convertVerseToEvents(verse);

    const expectedLines = [[
      [
        { index: 0, voice: 'v1', content: 'All', offset: 0 },
        { index: 0, voice: 'v2', content: '!!!!', offset: 0 },
      ],
      [
        { index: 4, voice: 'v1', content: 'the', offset: 1 },
        { index: 4, voice: 'v2', content: '-!!!!', offset: 0 },
      ],
      [
        { index: 8, voice: 'v1', content: 'leaves', offset: 1 },
        { index: 8, voice: 'v2', content: '-!!!!!!!', offset: 0 },
      ],
      [
        { index: 15, voice: 'v1', content: 'are', offset: 1 },
        { index: 15, voice: 'v2', content: '-!!!!', offset: 0 },
      ],
      [
        { index: 19, voice: 'c1', content: new Chord('Am'), offset: 1 },
        { index: 19, voice: 'v1', content: 'brown', offset: 1 },
        { index: 19, voice: 'v2', content: '-!!', offset: 0 },
      ]
    ]];

    expect(actualLines).toEqual(expectedLines);
  });

  test('should only split words when they are split', () => {
    const verse = [new Map([[
      'v1', [
        { index: 0, content: 'All' },
        { index: 4, content: 'the' },
        { index: 8, content: 'leaves' },
        { index: 15, content: 'are' },
        { index: 19, content: 'brown' }
      ]], [
      'v2', [
        { index: 0, content: '!!!!!!!!!!!!!!!!!!!!!' }
      ]
    ]])];

    const actualLines = convertVerseToEvents(verse);

    const expectedLines = [[
      [
        { index: 0, voice: 'v1', content: 'All', offset: 0 },
        { index: 0, voice: 'v2', content: '!!!!', offset: 0 },
      ],
      [
        { index: 4, voice: 'v1', content: 'the', offset: 1 },
        { index: 4, voice: 'v2', content: '-!!!!', offset: 0 },
      ],
      [
        { index: 8, voice: 'v1', content: 'leaves', offset: 1 },
        { index: 8, voice: 'v2', content: '-!!!!!!!', offset: 0 },
      ],
      [
        { index: 15, voice: 'v1', content: 'are', offset: 1 },
        { index: 15, voice: 'v2', content: '-!!!!', offset: 0 },
      ],
      [
        { index: 19, voice: 'v1', content: 'brown', offset: 1 },
        { index: 19, voice: 'v2', content: '-!!', offset: 0 },
      ]
    ]];

    expect(actualLines).toEqual(expectedLines);
  });
});
