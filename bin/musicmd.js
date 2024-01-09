#!/usr/bin/env node
import { createReadStream, createWriteStream } from "fs";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { render } from "./headless.js";

const argv = yargs(hideBin(process.argv))
  .command({
    command: "* [markdown]",
    describe: "Render the markdown to HTML",
  })
  .option("outfile", {
    alias: "o",
    describe: "render the output of infile to outfile",
    nargs: 1,
  })
  .option("transpose", {
    alias: "t",
    describe: "transpose notes and chords up or down",
    default: 0,
    nargs: 1,
    type: "number",
  })
  .option("theme", {
    describe: "set theme",
    default: "light",
    nargs: 1,
  })
  .help()
  .parse();

const ifp = argv.markdown ? createReadStream(argv.markdown) : process.stdin;
const ofp = argv.outfile ? createWriteStream(argv.outfile) : process.stdout;

const chunks = [];

ifp.on("data", (chunk) => {
  chunks.push(chunk.toString());
});

ifp.on("end", () => {
  const markdown = chunks.join("");
  ofp.write(render(markdown, argv.transpose, argv.theme));
  ofp.end();
});
