/**
 * @jest-environment jsdom
 */

import MarkdownIt from "markdown-it";
import MarkdownItMusic from "./index.js";

describe("Markdown It Music", () => {
  var md;

  beforeEach(() => {
    md = new MarkdownIt({ html: true }).use(MarkdownItMusic);
  });

  test("YouTube ID is parsed if present", () => {
    const expected = "1ClCpfeIELw";
    md.render(`---
youTubeId: ${expected}
---`);
    expect(md.meta.youTubeId).toEqual(expected);
  });
});
