const Parser = require('jsonparse');
const { Writable } = require('stream');

class JSONDocStream extends Writable {
  constructor(options) {
    super(options);
    this._reset();
  }

  _reset() {
    if (this.parser) {
      delete this.parser.onValue;
      delete this.parser.onError;
    }
    this.parser = new Parser();
    this.error = undefined;

    this.parser.onError = error => {
      this.error = error;
    };

    this.parser.onValue = value => {
      if (this.parser.stack.length === 0) {
        this.emit('parsed', value);
      }
    };
  }

  _write(chunk, encoding, callback) {
    // Send the chunk one byte at a time and
    // reset if we encounter an error
    const length = chunk.length;
    for (let i = 0; i < length; i++) {
      const character = Buffer.alloc(1, chunk[i]);
      this.parser.write(character);
      if (this.error) {
        this.emit('error', this.error);
        this._reset();
      }
    }
    callback();
  }
}

module.exports = JSONDocStream;
