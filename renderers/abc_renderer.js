'use strict';
const abc = require('abcjs');

function renderAbc(str, opts) {
  const div = document.createElement('div');
  abc.renderAbc(div, str, {
    visualTranspose: opts.transpose
  });
  return div.outerHTML;
}


module.exports = {
  'lang': 'abc',
  'callback': renderAbc
};
