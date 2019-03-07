'use strict';
const abc = require('./renderers/abc_renderer.js');
const chords = require('./renderers/chords_renderer_from_events.js');

function MarkdownMusic(md, musicOpts) {
  md.highlightRegistry = {};
  md.musicOpts = musicOpts;

  md.set({
    highlight: function(str, lang) {
      if (md.highlightRegistry.hasOwnProperty(lang)) {
        try {
          return `<pre style="display: none;"></pre>${md.highlightRegistry[lang](str, md.musicOpts)}`;
        } catch (error) {
          return `<pre>${str}</pre><div class="error">${error}</div>`;
        }
      }
    }
  });

  // Renderer registry
  md.highlightRegistry[abc.lang] = abc.callback;
  md.highlightRegistry[chords.lang] = chords.callback;

  // Renderer configuration functions
  md.setTranspose = function(transpose) {
    md.musicOpts.transpose = transpose;
  };
};

module.exports = MarkdownMusic;
