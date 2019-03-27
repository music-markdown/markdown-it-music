'use strict';

const randomColor = require('randomcolor');

class VoiceColors {
  constructor(defaultColors, theme) {
    this.colors = defaultColors ? defaultColors.slice() : ['blue', 'black', 'red', 'green', 'purple', 'teal'];
    this.hueOrder = ['pink', 'orange', 'green', 'purple', 'blue', 'yellow'];
    this.voiceColorMap = {};

    this.palette = theme.palette === 'dark' ? 'light' : 'dark';
    this.currentSeed = 42;
  }

  getUnusedColor() {
    if (this.colors.length > 0) {
      return this.colors.shift();
    }

    let hue = '';
    if (this.hueOrder.length > 0) {
      hue = this.hueOrder.shift();
    }

    return randomColor({ seed: this.currentSeed++, luminosity: this.palette, hue });
  }

  getVoiceColor(voice) {
    if (!(voice in this.voiceColorMap)) {
      this.voiceColorMap[voice] = this.getUnusedColor();
    }

    return this.voiceColorMap[voice];
  }
}

module.exports = VoiceColors;
