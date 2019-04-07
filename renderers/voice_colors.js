'use strict';

const randomColor = require('randomcolor');

class VoiceColors {
  constructor(defaultColors, voiceOrder) {
    this.colors = defaultColors || ['blue', 'black', 'green', 'purple', 'teal'];
    this.voiceColorMap = {};
  }

  getUnusedColor() {
    return this.colors.length > 0 ? this.colors.shift() : randomColor({ seed: 42 });
  }

  getVoiceColor(voice) {
    if (!(voice in this.voiceColorMap)) {
      this.voiceColorMap[voice] = this.getUnusedColor();
    }

    return this.voiceColorMap[voice];
  }

  setVoiceColors(voiceOrder) {
    voiceOrder.forEach((voice) => {
      if (!(voice in this.voiceColorMap)) {
        this.voiceColorMap[voice] = this.getVoiceColor(voice);
      }
    });
  }
}

module.exports = VoiceColors;
