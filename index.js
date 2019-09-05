const Parser = require('jsonparse');
const { Transform } = require('stream');

class JSONDocStream extends Transform {
    // Based on json-doc-stream
    constructor(options) {
        super({objectMode: true, ...options});
        this._reset();
    }

    _transform(chunk, encoding, callback) {
        const length = chunk.length;
        for (let i = 0; i < length; i++) {
            const character = Buffer.alloc(1, chunk[i]);
            this.parser.write(character);
            if (this.error) {
                this.emit('error', this.error);
                this._reset();
            }
        }
        return callback();
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
        const ctx = this;

        this.parser.onValue = value => {
            if (this.parser.stack.length === 0) {
                return ctx.push(value);
            }
        };
    }
};

module.exports = JSONDocStream;
