'use strict';
const abc = require('abcjs');

function renderAbc(str, opts) {
  const div = document.createElement('div');
  abc.renderAbc(div, str, {
    visualTranspose: opts.transpose,
    staffwidth: opts.maxWidth,
    paddingtop: 0,
    paddingbottom: 0,
    paddingright: 0,
    paddingleft: 0,
    wrap: { minSpacing: 1.8, maxSpacing: 2.7 },
  });
  return div.outerHTML;
}


module.exports = {
  'lang': 'abc',
  'callback': renderAbc
};
