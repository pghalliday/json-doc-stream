# json-doc-stream

Parse streams of JSON documents.

A simple wrapper for [jsonparse](https://www.npmjs.com/package/jsonparse) to efficiently parse a stream of multple JSON documents emitting events as each document completes containing the parsed data.

## Install

```
npm install json-doc-stream
```

## Usage

```javascript
const JSONDocStream = require('json-doc-stream');

const stream = new JSONDocStream();

stream.on('parsed', parsed => {
  // handle the parsed JSON document
  // could be an object, array, string,
  // number, boolean or null
});

stream.on('error', error => {
  // handle parse errors
});

stream.write(JSONdata);

// or

readableStream.pipe(stream);
```
