'use strict';
const abc = require('./abc_renderer.js');
const chords = require('./chords_renderer.js');

function MarkdownMusic(md, musicOpts) {
  md.highlightRegistry = {};
  md.musicOpts = musicOpts;

  md.set({
    highlight: function(str, lang) {
      if (md.highlightRegistry.hasOwnProperty(lang)) {
        return md.highlightRegistry[lang](str, md.musicOpts);
      }
    }
  });

  // Renderer registry
  md.highlightRegistry[abc.lang] = abc.callback;
  md.highlightRegistry[chords.lang] = chords.callback;

  // Renderer configuration functions
  md.setTranspose = function(transpose) {
    md.musicOpts.transpose = transpose;
  }
};

module.exports = MarkdownMusic;
