#!/usr/bin/env node

"use strict";

const render = require("./headless");
const fs = require("fs");
const yargs = require("yargs");

const argv = yargs
  .scriptName("musicmd")
  .command("* [markdown]", "Render the markdown to HTML")
  .option("outfile", {
    alias: "o",
    describe: "render the output of infile to outfile",
    nargs: 1,
  })
  .help().argv;

const ifp = argv.markdown ? fs.createReadStream(argv.markdown) : process.stdin;
const ofp = argv.outfile ? fs.createWriteStream(argv.outfile) : process.stdout;

const chunks = [];

ifp.on("data", (chunk) => {
  chunks.push(chunk.toString());
});

ifp.on("end", () => {
  ofp.write(render(chunks.join("")));
  ofp.end();
});
