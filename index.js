'use strict';
var abc = require('abcjs');

function MarkdownMusic(md) {
  console.log(md);

  md.set({
    highlight: function(str, lang) {
      if (lang === 'abc') {
        var div = document.createElement("div");
        abc.renderAbc(div, str);
        return div.outerHTML;
      }
    }
  });
};

module.exports = MarkdownMusic;
