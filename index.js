'use strict';
const meta = require('markdown-it-meta');
const abc = require('./renderers/abc_renderer.js');
const chords = require('./renderers/chords_renderer_from_events.js');

function MarkdownMusic(md) {
  md.use(meta);
  md.highlightRegistry = {};
  md.userOpts = {};

  // Override YAML meta data with user supplied options.
  md.core.ruler.push('mmd', ({ md }) => {
    Object.assign(md.meta, md.userOpts);
  });

  md.set({
    highlight: function(str, lang) {
      if (md.highlightRegistry.hasOwnProperty(lang)) {
        const callback = md.highlightRegistry[lang];
        try {
          // If we don't start our HTML with <pre, markdown-it will automatically wrap out output in <pre></pre>.
          return `<pre style="display: none;"></pre>${callback(str, md.meta)}`;
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
    md.userOpts.transpose = transpose;
  };

  // Restricts max renderable width (if the renderer supports it)
  md.setMaxWidth = function(maxWidth) {
    md.userOpts.maxWidth = maxWidth;
  };

  // Specifies the desired number of columns
  md.setColumnCount = function(columnCount) {
    md.userOpts.columnCount = columnCount;
  };
};

module.exports = MarkdownMusic;
