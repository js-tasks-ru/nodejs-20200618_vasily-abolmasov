const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  #size = 0;
  #filled = 0;

  constructor(options) {
    super();
    this.#size = options.limit;
  }

  _transform(chunk, encoding, callback) {
    this.#filled += chunk.length;
    if (this.#filled > this.#size) {
      throw new LimitExceededError('Error');
    }

    let str = chunk.toString();
    this.push(chunk);

    callback();
  }
}

module.exports = LimitSizeStream;
