const rewire = require('rewire');

const chordsRenderer = rewire('../chords_renderer.js');

describe('Chords renderer', () => {
  test('should get a list of chords given a string', () => {
    //expect(chordsRenderer.__get__('foo')()).toEqual(2);
  });
});
