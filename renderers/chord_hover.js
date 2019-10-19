"use strict";

const chordDiagram = require("./chord_diagram.js");
const { guitarChordbook } = require("../lib/chordbook.js");

const slowScrollFunction = `
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
}`;

const incrementIdFunction = `
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
`;

let nextId = 0;

function createDiagramDiv(voicing) {
  const svg = chordDiagram.renderChordDiagram(voicing);

  return `<div class="diagram">${svg}</div>`;
}

function addChordToDiv(chord) {
  if (guitarChordbook.has(chord.toString())) {
    const id = `chord${nextId++}`;

    let contentDiv = `<div class="diagram-content-container" id="${id}">`;

    const voicings = guitarChordbook.get(chord.toString());

    voicings.forEach(voicing => {
      contentDiv += createDiagramDiv(voicing);
    });

    contentDiv += "</div>";

    const leftButton =
      `<div>` +
      `<button class="scroll" onclick="slowScroll('${id}', 'left', 100, 2); incrementId('${id}', 'left');">❮` +
      `</button></div>`;
    const rightButton =
      `<div>` +
      `<button class="scroll" onclick="slowScroll('${id}', 'right', 100, 2); incrementId('${id}', 'right');">❯` +
      `</button></div>`;

    const contentScrollDiv =
      `<div class="content-scroll">` +
      `${leftButton}` +
      `${contentDiv}` +
      `${rightButton}` +
      `</div>`;

    const countDiv = `<div id="${id}-count">1 of ${voicings.length}</div>`;

    // TODO: Investigate using renderer rules to add script.
    if (!document.getElementById("chord-hover-script")) {
      const script = document.createElement("script");
      script.id = "chord-hover-script";
      script.innerHTML = `${slowScrollFunction}${incrementIdFunction}`;

      document.getElementsByTagName("body")[0].appendChild(script);
    }

    return (
      `<div class="diagram-container">` +
      `${contentScrollDiv}` +
      `${countDiv}` +
      `</div>`
    );
  }
  return undefined;
}

module.exports = {
  addChordToDiv
};
