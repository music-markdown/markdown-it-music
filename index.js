'use strict';
const abc = require('./abc_renderer.js');
const chords = require('./chords_renderer.js');

function MarkdownMusic(md, opts) {
  md.highlightRegistry = {};
  md.opts = opts;

  md.set({
    highlight: function(str, lang) {
      if (md.highlightRegistry.hasOwnProperty(lang)) {
        return md.highlightRegistry[lang](str, md.opts);
      }
    }
  });

  md.highlightRegistry[abc.lang] = abc.callback;
  md.highlightRegistry[chords.lang] = chords.callback;
};

module.exports = MarkdownMusic;
