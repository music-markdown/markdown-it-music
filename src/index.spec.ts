import MarkdownIt from "markdown-it";
import MarkdownMusic from "./index";

describe("Markdown It Music", () => {
  var md: any;

  beforeEach(() => {
    md = new MarkdownIt({ html: true }).use(MarkdownMusic);
  });

  test("YouTube ID is parsed if present", () => {
    const expected = "1ClCpfeIELw";
    md.render(`---
youTubeId: ${expected}
---`);
    expect(md.meta.youTubeId).toEqual(expected);
  });
});
