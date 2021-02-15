import MarkdownItMeta from "markdown-it-meta";
import MarkdownItFence from "markdown-it-fence";
import * as abc from "./renderers/abc_renderer";
import * as vextab from "./renderers/vextab_renderer";
import ChordsRenderer from "./renderers/chords_renderer";
import { parseVerse, isVoiceLine } from "./parsers/verse";
import MarkdownIt from "markdown-it";
import StateBlock from "markdown-it/lib/rules_block/state_block";
import Token from "markdown-it/lib/token";

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

export interface MarkdownItMusic extends MarkdownIt {
  rendererRegistry: {
    [key: string]: (str: string, opts: MmdOptions) => string;
  };
  userOpts: any;
  meta: any;
  chordsRenderer: ChordsRenderer;
  setTranspose: (transpose: number) => MarkdownItMusic;
  setMaxWidth: (maxWidth: number) => MarkdownItMusic;
  addHeader: (header: string) => MarkdownItMusic;
}

export default function MarkdownItMusic(md: MarkdownIt): void {
  const mmd = md as MarkdownItMusic;
  mmd.use(MarkdownItMeta);
  mmd.rendererRegistry = {};
  mmd.userOpts = { headers: [], transpose: 0, maxWidth: 0, chords: [""] };

  mmd.core.ruler.before("normalize", "mmd", (state) => {
    const mmd = state.md as MarkdownItMusic;
    // Inject the music markdown header.
    mmd.userOpts.headers.push(MUSIC_MARKDOWN_JS);
    const scriptToken = new state.Token("mmdHeader", "", 0);
    state.tokens.push(scriptToken);

    // Override YAML meta data with user supplied options.
    Object.assign(mmd.meta, mmd.userOpts);
    // Reset the ChordsRenderer when parsing a new source.
    mmd.chordsRenderer = new ChordsRenderer();
    return true;
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

  mmd.renderer.rules.mmdHeader = () => {
    return mmd.userOpts.headers.join("");
  };

  mmd.renderer.rules.mmdVerse = (tokens, idx) =>
    mmd.chordsRenderer.renderVerse(tokens[idx].meta, mmd.meta);

  mmd.rendererRegistry[abc.lang] = abc.callback;
  mmd.rendererRegistry[vextab.lang] = vextab.callback;

  // Renderer configuration functions
  mmd.setTranspose = (transpose) => {
    mmd.userOpts.transpose = transpose;
    return mmd;
  };

  // Restricts max renderable width (if the renderer supports it)
  mmd.setMaxWidth = (maxWidth) => {
    mmd.userOpts.maxWidth = maxWidth;
    return mmd;
  };

  mmd.addHeader = (header) => {
    mmd.userOpts.headers.push(header);
    return mmd;
  };

  MarkdownItFence(mmd, "MarkdownMusic", {
    marker: ":",
    render: (tokens: Token[], idx: number): string => {
      const token = tokens[idx];
      return mmd.rendererRegistry[token.info](token.content, mmd.meta);
    },
    validate: (name: string) => name in mmd.rendererRegistry,
  });
}

function isBlankLine(state: StateBlock, line: number): boolean {
  return state.bMarks[line] === state.eMarks[line];
}

function isNotDoubleBlankLine(state: StateBlock, line: number): boolean {
  return (
    state.bMarks[line] !== state.eMarks[line] ||
    state.bMarks[line + 1] !== state.eMarks[line + 1]
  );
}

function getLines(
  state: StateBlock,
  startLine: number,
  endLine?: number
): string {
  return state.src.slice(
    state.bMarks[startLine],
    state.eMarks[endLine ? endLine - 1 : startLine]
  );
}
