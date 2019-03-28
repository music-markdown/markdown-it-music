'use strict';

const chordDiagram = require('./chord_diagram.js');
const { guitarChordLibrary } = require('./chord_library.js');

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

function createDiagramDiv(voicing, chordDiagramContainerDiv) {
  const svg = chordDiagram.renderChordDiagram(voicing);

  const chordDiagramDiv = document.createElement('div');

  chordDiagramDiv.className = 'diagram';
  chordDiagramDiv.innerHTML += svg;

  chordDiagramContainerDiv.appendChild(chordDiagramDiv);
}

function addChordToDiv(voiceDiv, chord) {
  voiceDiv.className += ' chord';

  if (guitarChordLibrary.has(chord.toString())) {
    const containerDiv = document.createElement('div');
    containerDiv.className = 'diagram-container';

    const contentDiv = document.createElement('div');
    contentDiv.className = 'diagram-content-container';

    const id = `chord${nextId++}`;
    contentDiv.id = id;

    if (!document.getElementById('chord-hover-script')) {
      const script = document.createElement('script');
      script.id = 'chord-hover-script';
      script.innerHTML = `${slowScrollFunction}${incrementIdFunction}`;

      document.getElementsByTagName('body')[0].appendChild(script);
    }

    const contentScrollDiv = document.createElement('div');
    contentScrollDiv.className = 'content-scroll';

    const leftButton = document.createElement('div');
    leftButton.innerHTML = `<button class="scroll"
      onclick="slowScroll('${id}', 'left', 100, 2); incrementId('${id}', 'left');">❮`;

    const rightButton = document.createElement('div');
    rightButton.innerHTML = `<button class="scroll" 
      onclick="slowScroll('${id}', 'right', 100, 2); incrementId('${id}', 'right');">❯`;

    contentScrollDiv.appendChild(leftButton);
    contentScrollDiv.appendChild(contentDiv);
    contentScrollDiv.appendChild(rightButton);

    const voicings = guitarChordLibrary.get(chord.toString());

    voicings.forEach((voicing) => {
      createDiagramDiv(voicing, contentDiv);
    });

    const countDiv = document.createElement('div');
    countDiv.id = `${id}-count`;
    countDiv.innerHTML = `1 of ${voicings.length}`;
    containerDiv.appendChild(contentScrollDiv);
    containerDiv.appendChild(countDiv);

    voiceDiv.appendChild(containerDiv);
  } else {
    voiceDiv.className += ' highlight';
  }
}

module.exports = {
  addChordToDiv
};
