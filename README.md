# json-doc-stream

Parse streams of JSON documents.

A simple wrapper for [clarinet](https://www.npmjs.com/package/clarinet) to efficiently parse a stream of multple JSON documents emitting events as each document completes containing the parsed data.

## Install

```
npm install json-doc-stream
```

## Usage

```javascript
const JSONDocStream = require('json-doc-stream');

const stream = new JSONDocStream();

stream.on('doc', doc => {
  // handle the parsed JSON document
  // could be an array, object, number or null
});

stream.on('error', error => {
  // handle parse errors
});

stream.on('end', () => {
  // if the stream is ended, wait for this event before trying to write more data
});

stream.write(JSONdata);

// or

readableStream.pipe(stream);
```
