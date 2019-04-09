'use strict';
const abc = require('abcjs');
const memoize = require('fast-memoize');
const createMemoizeCache = require('../lib/createMemoizeCache.js');
const MARGIN_RIGHT = 2;

function renderAbc(str, opts) {
  const div = document.createElement('div');
  abc.renderAbc(div, str, {
    visualTranspose: opts.transpose,
    staffwidth: opts.maxWidth - MARGIN_RIGHT,
    paddingtop: 0,
    paddingbottom: 0,
    paddingright: 0,
    paddingleft: 0,
    wrap: { minSpacing: 1.8, maxSpacing: 2.7 },
  });
  return div.outerHTML;
}

const memoizedAbc = memoize(renderAbc, {
  cache: {
    create: createMemoizeCache
  }
});


module.exports = {
  'lang': 'abc',
  'callback': memoizedAbc
};
