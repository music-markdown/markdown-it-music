import { renderChordDiagramMemoized } from "./chord_diagram.js";
import { guitarChordbook } from "../lib/chordbook.js";

export function chordCarousel(chord, renderer = renderChordDiagramMemoized) {
  const attrValue = chord.toAttributeValue();
  const id = `chord-${attrValue}`;

  const voicings = guitarChordbook.get(chord.toString());

  const carousel =
    `<div class="carousel">` +
    `<div><button class="scroll" onclick="toggleSlide('${id}', -1);">❮</button></div>` +
    `<div id="${id}" class="diagrams">` +
    voicings
      .map((voicing) => `<div class="diagram">${renderer(voicing)}</div>`)
      .join("") +
    `</div>` +
    `<div><button class="scroll" onclick="toggleSlide('${id}', 1);">❯</button></div>` +
    `</div>`;

  return (
    `<div id="tooltip-${attrValue}" class="tooltip"` +
    ` onmouseover="cancelHideTooltip('${attrValue}')"` +
    ` onmouseout="hideTooltip('${attrValue}')">` +
    `<div class="chord-carousel">` +
    carousel +
    `<div id="${id}-count">1 of ${voicings.length}</div>` +
    `</div>` +
    `<div id="arrow-${attrValue}" class="arrow"></div>` +
    `</div>`
  );
}
