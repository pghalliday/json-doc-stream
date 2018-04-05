const clarinet = require('clarinet');
const { Writable } = require('stream');

function type(value) {
  if (value instanceof Array) {
    return 'array';
  }
  if (value instanceof Object) {
    return 'object';
  }
}

export default class JSONDocStream extends Writable {
  constructor(options) {
    super(options);
    let stack;
    let keyStack;
    let current;
    let currentKey;
    const parser = clarinet.parser();

    const reset = () => {
      stack = [];
      keyStack = [];
      current = undefined;
      currentKey = undefined;
    };
    reset();

    const push = (next, key) => {
      switch (type(current)) {
        case 'array':
          current.push(next);
          break;
        case 'object':
          current[currentKey] = next;
          break;
        default:
          current = next;
          currentKey = key;
          return;
      }
      stack.push(current);
      keyStack.push(currentKey);
      current = next;
      currentKey = key;
    };

    const pop = () => {
      const last = current;
      current = stack.pop();
      currentKey = keyStack.pop();
      if (!current) {
        this.emit('doc', last);
      }
    };

    parser.onerror = error => {
      this.emit('error', error);
      reset();
      parser.resume();
    };

    parser.onkey = key => {
      currentKey = key;
    };

    parser.onvalue = value => {
      switch (type(current)) {
        case 'array':
          current.push(value);
          break;
        case 'object':
          current[currentKey] = value;
          break;
        default:
          this.emit('doc', value);
          break;
      }
    };

    parser.onopenobject = key => {
      push({}, key);
    };

    parser.oncloseobject = pop;

    parser.onopenarray = () => {
      push([]);
    };

    parser.onclosearray = pop;

    parser.onend = () => {
      this.emit('end');
    };

    this.parser = parser;
  }

  _write(chunk, encoding, callback) {
    this.parser.write(chunk.toString('utf8'));
    callback();
  }

  _final(callback) {
    this.parser.close();
    callback();
  }
}
