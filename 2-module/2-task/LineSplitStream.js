const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  #str = '';
  constructor(options) {
    super(options);
  }

  _transform(chunk, encoding, callback) {
    const chunkString = chunk.toString();

    let rowStart = 0;
    while (true) {
      let rowEnd = chunkString.indexOf(os.EOL, rowStart);
      if (rowEnd >= 0) {
        this.push(this.#str + chunkString.substring(rowStart, rowEnd))
        this.#str = '';
      } else {
        this.#str += chunkString.substring(rowStart, chunkString.length);
        break;
      }
      rowStart = ++rowEnd;

      if (rowEnd >= chunkString.length) {
        break;
      }
    }
    callback();
  }

  _flush(callback) {
    this.push(this.#str);
    callback();
  }
}

module.exports = LineSplitStream;
