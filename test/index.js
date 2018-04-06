const fs = require('fs');
const JSONDocStream = require('..');

const stream = new JSONDocStream();
stream.on('json', json => {
  console.log('json:', json);
});
stream.on('parsed', parsed => {
  console.log('parsed:', parsed);
});
stream.on('error', error => {
  console.error(error.message);
});

// fs.createReadStream('./test.json')
// .pipe(stream);

const CHUNK_SIZE = 10;
let data = fs.readFileSync('./test.json', 'utf8');
// let data = '{}';
while (data.length > 0) {
  const chunk = data.slice(0, CHUNK_SIZE);
  data = data.slice(CHUNK_SIZE);
  stream.write(chunk);
}
stream.end();
