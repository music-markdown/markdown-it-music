'use strict';
const meta = require('markdown-it-meta');
const abc = require('./renderers/abc_renderer.js');
const ChordsRenderer = require('./renderers/chords_renderer.js');
const { parseVerse, isVoiceLine } = require('./parsers/verse');

function MarkdownMusic(md) {
  md.use(meta);
  md.highlightRegistry = {};
  md.userOpts = {};

  md.core.ruler.push('mmd', ({ md }) => {
    // Override YAML meta data with user supplied options.
    Object.assign(md.meta, md.userOpts);
    // Reset the ChordsRenderer when parsing a new source.
    md.chordsRenderer = new ChordsRenderer();
  });

  // Override YAML meta data with user supplied options.
  md.block.ruler.after('meta', 'mmd', (state) => {
    let currentLineIndex = state.line;
    while (currentLineIndex < state.lineMax && (
      isBlankLine(state, currentLineIndex) || isVoiceLine(getLines(state, currentLineIndex)))) {
      currentLineIndex++;
    }

    if (currentLineIndex == state.line) {
      // Signal that this rule didn't consume anything
      return false;
    }

    // Parse the verse and store in token's content
    const verseToken = new state.Token('mmd_verse', '', 0);
    verseToken.content = parseVerse(getLines(state, state.line, currentLineIndex));
    state.tokens.push(verseToken);

    // Consume the lines of the music markdown block
    state.line = currentLineIndex;
    return true;
  });

  md.renderer.rules.mmd_verse = (tokens, idx) => md.chordsRenderer.renderVerse(tokens[idx].content);

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

  // Specifies the desired font size
  md.setFontSize = function(fontSize) {
    md.userOpts.fontSize = fontSize;
    return md;
  };
};

function isBlankLine(state, line) {
  return state.bMarks[line] === state.eMarks[line];
}

function getLines(state, startLine, endLine) {
  return state.src.slice(state.bMarks[startLine], state.eMarks[endLine - 1 || startLine]);
}

module.exports = MarkdownMusic;
