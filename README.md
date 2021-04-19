[![Build Status](https://travis-ci.com/music-markdown/markdown-it-music.svg?branch=master)](https://travis-ci.com/music-markdown/markdown-it-music)

# markdown-it-music

Plugin for markdown-it that renders guitar chords and tabs, abc music and more.

## CLI

This plugin provides a basic CLI for rendering music markdown without a browser.

### Installation

```console
$ npm i -g markdown-it-music
```

### Basic Usage

```console
$ musicmd [input-markdown-file] -o [output-html-file]
```

### All Options

```console
$ musicmd --help
musicmd [markdown]

Render the markdown to HTML

Options:
      --version    Show version number                                 [boolean]
  -o, --outfile    render the output of infile to outfile
  -t, --transpose  transpose notes and chords up or down   [number] [default: 0]
      --help       Show help                                           [boolean]
```
