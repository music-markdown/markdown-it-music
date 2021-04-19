"use strict";
const meta = require("markdown-it-meta");
const markdownitfence = require("markdown-it-fence");
const abc = require("./renderers/abc_renderer.js");
const vextab = require("./renderers/vextab_renderer.js");
const ChordsRenderer = require("./renderers/chords_renderer.js");
const { parseVerse, isVoiceLine } = require("./parsers/verse");

const MUSIC_MARKDOWN_JS = `<script>
function slowScroll(id, direction, distance, step) {
  var element = document.getElementById(id);
  
  if (element) {
    var scrollAmount = 0;
    var slideTimer = setInterval(function() {
      element.scrollLeft += direction === 'left' ? -step : step;

      scrollAmount += step;
      if(scrollAmount >= distance){
          window.clearInterval(slideTimer);
      }
    });
  }
}

function incrementId(id, direction) {
  var countId = id + '-count'
  var element = document.getElementById(countId);

  if (element) {
    var values = element.innerHTML.split(' of ');
    var currentValue = parseInt(values[0]);

    if (direction === 'left' && currentValue > 1) {
      element.innerHTML = currentValue - 1;
      element.innerHTML += ' of ' + values[1];
    } else if (direction === 'right' && currentValue < parseInt(values[1])) {
      element.innerHTML = currentValue + 1;
      element.innerHTML += ' of ' + values[1];
    }
  }
}
</script>
`;

function MarkdownMusic(md) {
  md.use(meta);
  md.rendererRegistry = {};
  md.userOpts = { headers: [] };

  md.core.ruler.before("normalize", "mmd", (state) => {
    // Inject the music markdown header.
    state.md.userOpts.headers.push(MUSIC_MARKDOWN_JS);
    const scriptToken = new state.Token("mmdHeader", "", 0);
    state.tokens.push(scriptToken);
  });

  md.core.ruler.after("block", "mmd", (state) => {
    // Reset the ChordsRenderer when parsing a new source.
    state.md.chordsRenderer = new ChordsRenderer(md.getOptions());
  });

  md.block.ruler.after("meta", "mmd", (state) => {
    let currentLineIndex = state.line;
    while (
      currentLineIndex < state.lineMax &&
      isNotDoubleBlankLine(state, currentLineIndex) &&
      (isBlankLine(state, currentLineIndex) ||
        isVoiceLine(getLines(state, currentLineIndex)))
    ) {
      currentLineIndex++;
    }

    if (currentLineIndex == state.line) {
      // Signal that this rule didn't consume anything
      return false;
    }

    // Parse the verse and store in token's content
    const verseToken = new state.Token("mmdVerse", "", 0);
    verseToken.meta = parseVerse(getLines(state, state.line, currentLineIndex));
    state.tokens.push(verseToken);

    // Consume the lines of the music markdown block
    state.line = currentLineIndex;
    return true;
  });

  md.renderer.rules.mmdHeader = () => {
    return md.userOpts.headers.join("");
  };

  md.renderer.rules.mmdVerse = (tokens, idx) => {
    return md.chordsRenderer.renderVerse(tokens[idx].meta);
  };

  md.rendererRegistry[abc.lang] = abc.callback;
  md.rendererRegistry[vextab.lang] = vextab.callback;

  // Renderer configuration functions
  md.setTranspose = (transpose) => {
    md.userOpts.transpose = transpose;
    return md;
  };

  // Restricts max renderable width (if the renderer supports it)
  md.setMaxWidth = (maxWidth) => {
    md.userOpts.maxWidth = maxWidth;
    return md;
  };

  md.addHeader = (header) => {
    md.userOpts.headers.push(header);
    return md;
  };

  md.getOptions = () => {
    return Object.assign({}, md.meta, md.userOpts);
  };

  return markdownitfence(md, "MarkdownMusic", {
    marker: ":",
    render: (tokens, idx) => {
      const token = tokens[idx];
      return md.rendererRegistry[token.info](token.content, md.getOptions());
    },
    validate: (name) => name in md.rendererRegistry,
  });
}

function isBlankLine(state, line) {
  return state.bMarks[line] === state.eMarks[line];
}

function isNotDoubleBlankLine(state, line) {
  return (
    state.bMarks[line] !== state.eMarks[line] ||
    state.bMarks[line + 1] !== state.eMarks[line + 1]
  );
}

function getLines(state, startLine, endLine) {
  return state.src.slice(
    state.bMarks[startLine],
    state.eMarks[endLine - 1 || startLine]
  );
}

module.exports = MarkdownMusic;
