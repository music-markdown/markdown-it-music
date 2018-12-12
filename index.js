'use strict';
var abc = require('./abc_renderer.js');
var chords = require('./chords_renderer.js');


function MarkdownMusic(md) {
  md.highlightRegistry = {};

  md.set({
    highlight: function(str, lang) {
      if (md.highlightRegistry.hasOwnProperty(lang)) {
        return md.highlightRegistry[lang](str);
      }
    }
  });

  md.highlightRegistry[abc.lang] = abc.callback;
  md.highlightRegistry[chords.lang] = chords.callback;
};


module.exports = MarkdownMusic;
