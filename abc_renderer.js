'use strict';
var abc = require('abcjs');


function renderAbc(str) {
  var div = document.createElement("div");
  abc.renderAbc(div, str);
  return div.outerHTML;
}


module.exports = {
  'lang': 'abc',
  'callback': renderAbc
}
