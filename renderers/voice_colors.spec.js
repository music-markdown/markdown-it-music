'use strict';

const VoiceColors = require('./voice_colors.js');

describe('Voice Colors', () => {
  test('should use the same color for the same voice', () => {
    const voiceColors = new VoiceColors(['black', 'blue']);

    expect(voiceColors.getVoiceColor('c1')).toEqual('black');
    expect(voiceColors.getVoiceColor('c1')).toEqual('black');
    expect(voiceColors.getVoiceColor('l1')).toEqual('blue');
    expect(voiceColors.getVoiceColor('l1')).toEqual('blue');
  });

  test('should use the provided default colors before generating colors', () => {
    const voiceColors = new VoiceColors(['black', 'blue']);

    expect(voiceColors.getVoiceColor('c1')).toEqual('black');
    expect(voiceColors.getVoiceColor('l1')).toEqual('blue');
    expect(voiceColors.getVoiceColor('a1')).not.toEqual('black');
    expect(voiceColors.getVoiceColor('a1')).not.toEqual('blue');
  });

  test('should be consistent in color generated order so when you come back, it is the same color', () => {
    const firstVoiceColors = new VoiceColors([]);
    const secondVoiceColors = new VoiceColors([]);

    expect(firstVoiceColors.getVoiceColor('c1')).toEqual(secondVoiceColors.getVoiceColor('c1'));
    expect(firstVoiceColors.getVoiceColor('l1')).toEqual(secondVoiceColors.getVoiceColor('l1'));
  });
});
