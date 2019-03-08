'use strict';

const randomColor = require('randomcolor');

class VoiceColors {
  constructor(defaultColors) {
    this.colors = defaultColors || ['blue', 'black', 'red', 'green', 'purple', 'teal'];
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
}

module.exports = VoiceColors;
