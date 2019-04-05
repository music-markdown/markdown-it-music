'use strict';
const meta = require('markdown-it-meta');
const abc = require('./renderers/abc_renderer.js');
const chords = require('./renderers/chords_renderer.js');

function MarkdownMusic(md) {
  md.use(meta);
  md.highlightRegistry = {};
  md.userOpts = {};

  // Override YAML meta data with user supplied options.
  md.core.ruler.push('mmd', ({ md }) => {
    Object.assign(md.meta, md.userOpts);
  });

  md.inline.ruler.before('text', 'mmd', (state) => {
    // If the paragraph starts with c1, then treat it as a phrase (we'll improve it saturday)
    if (state.src.startsWith('c1: ')) {
      // Create a token that will be consumed by the renderer
      const openToken = new state.Token('mmd_phrase', '', 0);
      // Pass the contents of the phrase through the token via the meta
      openToken.meta = state.src;
      state.tokens.push(openToken);
      // Consume the contents of the paragraph by moving the state's position index
      state.pos = state.posMax;
      // Signal that this rule consumed all the src data available
      return true;
    }
    // Signal that this rule didn't consume anything
    return false;
  });

  md.renderer.rules.mmd_phrase = (tokens, idx) => {
    console.log(tokens);
    // Take the phrase and pass it to our renderer
    return chords.callback(tokens[idx].meta);
  };

  md.set({
    highlight: function(str, lang) {
      if (md.highlightRegistry.hasOwnProperty(lang)) {
        const callback = md.highlightRegistry[lang];
        // If we don't start our HTML with <pre, markdown-it will automatically wrap our output in <pre></pre>.
        return `<pre style="display: none;"></pre>${callback(str, md.meta)}`;
      }
    }
  });

  // Renderer registry
  md.highlightRegistry[abc.lang] = abc.callback;
  md.highlightRegistry[chords.lang] = chords.callback;

  // Renderer configuration functions
  md.setTranspose = function(transpose) {
    md.userOpts.transpose = transpose;
    return md;
  };

  // Restricts max renderable width (if the renderer supports it)
  md.setMaxWidth = function(maxWidth) {
    md.userOpts.maxWidth = maxWidth;
    return md;
  };

  // Specifies the desired number of columns
  md.setColumnCount = function(columnCount) {
    md.userOpts.columnCount = columnCount;
    return md;
  };

  // Specifies the desired font size
  md.setFontSize = function(fontSize) {
    md.userOpts.fontSize = fontSize;
    return md;
  };
};

module.exports = MarkdownMusic;
