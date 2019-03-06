'use strict';

const rewire = require('rewire');
const Chord = require('./chord.js');
const eventsjs = rewire('./events.js');

const convertVerseToEvents = eventsjs.__get__('convertVerseToEvents');
const EventList = eventsjs.__get__('EventList');

describe('Event', () => {
  test('should add voices', () => {
    const expectedEvent = [
      { index: 4, voice: 'c1', content: 'G' },
      { index: 4, voice: 'c2', content: 'C' },
      { index: 4, voice: 'l1', content: 'longest' },
      { index: 4, voice: 'a1', content: 'crash!' },
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

    const eventList = new EventList();
    const actualEvent = eventList.createEventListFromPhrase(nextVoices, ['c1', 'c2', 'l1', 'a1']);

    expect(actualEvent).toEqual(expectedEvent);
  });

  test('should only add voices that are in index range', () => {
    const nextVoices = new Map([[
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

    const expectedEvent = [
      { index: 0, voice: 'l1', content: 'The' },
      { index: 0, voice: 'l2', content: 'Test' }
    ];

    const eventList = new EventList();
    const actualEvent = eventList.createEventListFromPhrase(nextVoices, ['c1', 'c2', 'l1', 'l2']);

    expect(actualEvent).toEqual(expectedEvent);
  });

  test('should add next index first', () => {
    const nextVoices = new Map([[
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

    const expectedEvent = [
      { index: 0, voice: 'c1', content: 'G' },
      { index: 0, voice: 'l1', content: 'The' }
    ];

    const eventList = new EventList();
    const actualEvent = eventList.createEventListFromPhrase(nextVoices, ['c1', 'c2', 'l1', 'l2']);

    expect(actualEvent).toEqual(expectedEvent);
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

    const expectedEvents = [
      [
        [{ index: 0, voice: 'l1', content: 'All' }],
        [{ index: 4, voice: 'l1', content: 'the' }],
        [{ index: 8, voice: 'l1', content: 'leaves' }],
        [{ index: 15, voice: 'l1', content: 'are' }],
        [
          { index: 19, voice: 'c1', content: new Chord('A', 'm') },
          { index: 19, voice: 'l1', content: 'brown' },
        ]
      ],
      [
        [{ index: 0, voice: 'c1', content: new Chord('G') }],
        [{ index: 3, voice: 'c1', content: new Chord('F') }],
        [{ index: 6, voice: 'l1', content: 'and' }],
        [{ index: 10, voice: 'l1', content: 'the' }],
        [
          { index: 14, voice: 'c1', content: new Chord('G') },
          { index: 14, voice: 'l1', content: 'sky' },
        ],
        [{ index: 18, voice: 'l1', content: 'is' }],
        [
          { index: 21, voice: 'c1', content: new Chord('E', 'sus2') },
          { index: 21, voice: 'l1', content: 'gray.' },
        ],
        [{ index: 27, voice: 'c1', content: new Chord('E') }]
      ]
    ];

    const actualEventList = convertVerseToEvents(verse);
    expect(actualEventList).toEqual(expectedEvents);
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

    const expectedEventList = [
      [
        [
          { index: 0, voice: 'c1', content: new Chord('A') },
          { index: 0, voice: 'l1', content: 'longest' },
        ],
        [
          { index: 8, voice: 'l1', content: 'is' },
        ],
        [
          { index: 11, voice: 'c1', content: new Chord('C') },
          { index: 11, voice: 'l1', content: 'supercali' }
        ],
        [
          { index: 20, voice: 'c1', content: new Chord('D') },
          { index: 20, voice: 'l1', content: '-fragilistic' }
        ],
        [
          { index: 32, voice: 'c1', content: new Chord('E') },
          { index: 32, voice: 'l1', content: '-expialidocious' }
        ],
      ]
    ];

    const actualEventList = convertVerseToEvents(verse);

    expect(actualEventList).toEqual(expectedEventList);
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

    const expectedEventList = [
      [
        [{ index: 0, voice: 'c1', content: new Chord('Am') }, { index: 0, voice: 'l1', content: 'Wonder' }],
        [{ index: 6, voice: 'c1', content: new Chord('C') }, { index: 6, voice: 'l1', content: '-ful' }]
      ],
      [
        [{ index: 0, voice: 'c1', content: new Chord('Am') }, { index: 0, voice: 'l1', content: 'Test' }],
        [{ index: 4, voice: 'c1', content: new Chord('C') }, { index: 4, voice: 'l1', content: '-ing' }]
      ]
    ];

    const actualEventList = convertVerseToEvents(verse);

    expect(actualEventList).toEqual(expectedEventList);
  });
});
