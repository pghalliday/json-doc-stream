# json-doc-stream

Parse streams of JSON documents.

A simple wrapper for [`jsonparse`](https://www.npmjs.com/package/jsonparse) to efficiently parse a stream of multple JSON documents emitting events as each document completes containing the parsed data. This library handles most corner cases involved in streaming JSON documents over multiple lines. However if you have simple uses cases and can stream JSON documents as single lines then you may get more mileage out of [`simple-json-doc-stream`](https://www.npmjs.com/package/simple-json-doc-stream).

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
