const HEADER = `<script>
  function slowScroll(id, direction, distance, step) {
    var element = document.getElementById(id);

    if (element) {
      var scrollAmount = 0;
      var slideTimer = setInterval(function () {
        element.scrollLeft += direction === "left" ? -step : step;

        scrollAmount += step;
        if (scrollAmount >= distance) {
          window.clearInterval(slideTimer);
        }
      });
    }
  }

  function incrementId(id, direction) {
    var countId = id + "-count";
    var element = document.getElementById(countId);

    if (element) {
      var values = element.innerHTML.split(" of ");
      var currentValue = parseInt(values[0]);

      if (direction === "left" && currentValue > 1) {
        element.innerHTML = currentValue - 1;
        element.innerHTML += " of " + values[1];
      } else if (direction === "right" && currentValue < parseInt(values[1])) {
        element.innerHTML = currentValue + 1;
        element.innerHTML += " of " + values[1];
      }
    }
  }
</script>

<style id="layout">
  .chart {
    font-family: "Monaco", "Menlo", "Consolas", monospace;
  }

  .voice {
    display: flex;
    white-space: pre;
  }

  .line {
    display: flex;
    flex-wrap: wrap;
    white-space: pre;
    break-inside: avoid;
  }

  .chord {
    cursor: help;
  }

  .highlight {
    color: red;
    font-weight: bold;
  }

  .diagram-content-container {
    display: flex;
    overflow-x: hidden;
  }

  .diagram-container {
    border: 1px solid #e3e3e3;
    background: white;
    color: black;
    text-align: center;
    width: 126px;
    height: 120px;
    z-index: 500;
    position: absolute;
    transform: translate(-40%, -100%);
    cursor: default;
  }

  .chord .diagram-container {
    visibility: hidden;
    opacity: 0;
    transition: visibility 0s linear 0.4s, opacity 0.4s linear;
  }

  .chord:hover .diagram-container {
    visibility: visible;
    opacity: 1;
    transition-delay: 0.1s;
    -webkit-transition: opacity 0.1s ease-in;
    -moz-transition: opacity 0.1s ease-in;
    -ms-transition: opacity 0.1s ease-in;
    -o-transition: opacity 0.1s ease-in;
    transition: opacity 0.1s ease-in;
  }

  .diagram {
    width: 100px;
    flex-shrink: 0;
    height: 100px;
    display: flex;
  }

  .scroll {
    background: none;
    border: none;
    padding: 0;
    margin: 0;
    height: 100%;
    width: 12px;
  }

  .content-scroll {
    display: flex;
  }

  .scroll:focus {
    outline: none;
  }

  .empty {
    height: 200px;
  }
</style>
`;

const LIGHT_THEME = `
  body {
    color: black;
  }

  .c1 {
    color: darkblue;
  }

  .c2 {
    color: darkorange;
  }

  .l1 {
    color: black;
  }

  .l2 {
    color: darkgreen;
  }

  .l3 {
    color: darkmagenta;
  }

  .l4 {
    color: darkred;
  }
`;

const DARK_THEME = `
  body {
    color: white;
    background-color: #303030;
  }

  .c1 {
    color: #8bacf9;
  }

  .c2 {
    color: #fe7f29;
  }

  .l1 {
    color: #fefefe;
  }

  .l2 {
    color: #009a2a;
  }

  .l3 {
    color: #ff9fb0;
  }

  .l4 {
    color: #fcdb95;
  }

  svg {
    filter: invert(100%);
  }

  .diagram svg {
    filter: invert(0%);
  }
`;

function getThemeStyles(theme) {
  if (theme === "light") {
    return LIGHT_THEME;
  }

  if (theme === "dark") {
    return DARK_THEME;
  }

  return theme;
}

export function getHeader(opts = { theme: "light", fontSize: 1 }) {
  return (
    HEADER +
    `
<style id="theme">
  body {
    font-family: "Roboto", "Helvetica", "Arial", sans-serif;
    font-size: ${opts.fontSize}em;
  }
${getThemeStyles(opts.theme)}
</style>
  `
  );
}
