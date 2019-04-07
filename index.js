'use strict';
const meta = require('markdown-it-meta');
const abc = require('./renderers/abc_renderer.js');
const ChordsRenderer = require('./renderers/chords_renderer.js');
const { parseVerse } = require('./parsers/verse');

function MarkdownMusic(md) {
  md.use(meta);
  md.highlightRegistry = {};
  md.userOpts = {};

  // Override YAML meta data with user supplied options.
  md.core.ruler.push('mmd', ({ md }) => {
    Object.assign(md.meta, md.userOpts);
    md.chordsRenderer = new ChordsRenderer();
  });

  // Override YAML meta data with user supplied options.
  md.block.ruler.after('meta', 'mmd', (state) => {
    const voicePattern = /^([a-zA-Z-_]+)([0-9]*):\s(.*)/;

    let currentLineIndex = state.line;
    while (currentLineIndex < state.lineMax && (
      state.bMarks[currentLineIndex] === state.eMarks[currentLineIndex] ||
      getLines(state, currentLineIndex).match(voicePattern))) {
      currentLineIndex++;
    }
    if (currentLineIndex != state.line) {
      // We are processing
      const verse = parseVerse(getLines(state, state.line, currentLineIndex));
      // Create a token that will be consumed by the renderer
      const verseToken = new state.Token('mmd_verse', '', 0);
      // Pass the contents of the phrase through the token via the meta
      verseToken.content = verse;
      state.tokens.push(verseToken);
      // Consume the lines of the music markdown block
      state.line = currentLineIndex;
      // Signal that this rule consumed all the src data available
      return true;
    }
    // Signal that this rule didn't consume anything
    return false;
  });

  md.renderer.rules.mmd_verse = (tokens, idx) => {
    console.log(tokens);
    // Take the verse and pass it to our renderer
    return md.chordsRenderer.renderVerse(tokens[idx].content);
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

function getLines(state, startLine, endLine) {
  return state.src.slice(state.bMarks[startLine], state.eMarks[endLine - 1 || startLine]);
}

module.exports = MarkdownMusic;
