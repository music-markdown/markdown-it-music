import markdownitfence from "markdown-it-fence";
import meta from "markdown-it-meta";
import { getHeader } from "./header.js";
import { isVoiceLine, parseVerse } from "./parsers/verse.js";
import * as abc from "./renderers/abc_renderer.js";
import { chordCarousel } from "./renderers/chord_carousel.js";
import { ChordsRenderer } from "./renderers/chords_renderer.js";
// import * as vextab from "./renderers/vextab_renderer.js";

export default function MarkdownMusic(md) {
  md.use(meta);
  md.rendererRegistry = {};
  md.userOpts = { headers: [] };

  md.core.ruler.before("normalize", "mmd", (state) => {
    // Inject the music markdown header.
    const opts = md.getOptions();
    const header = getHeader(opts);
    state.md.userOpts.headers.push(header);
    state.tokens.push(new state.Token("mmdHeader", "", 0));
  });

  md.core.ruler.after("block", "mmd", (state) => {
    // Reset the ChordsRenderer when parsing a new source.
    state.md.chordsRenderer = new ChordsRenderer(md.getOptions());
  });

  md.core.ruler.push("footer", (state) => {
    state.tokens.push(new state.Token("mmdFooter", "", 0));
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

  md.renderer.rules.mmdFooter = () => {
    return md.chordsRenderer.chordsUsed
      .map((voicing) => chordCarousel(voicing))
      .join("");
  };

  md.rendererRegistry[abc.lang] = abc.callback;
  // md.rendererRegistry[vextab.lang] = vextab.callback;

  // Renderer configuration functions
  md.setTranspose = (transpose) => {
    md.userOpts.transpose = transpose;
    return md;
  };

  md.setTheme = (theme) => {
    md.userOpts.theme = theme;
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
    state.eMarks[endLine - 1 || startLine],
  );
}
