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
        // console.log(this.#str + chunkString.substring(rowStart, rowEnd));
        this.#str = '';
      } else {
        this.#str += chunkString.substring(rowStart, chunkString.length);
        // console.log(this.#str);
        break;
      }
      // rowEnd = rowEnd >= 0 ? rowEnd : chunkString.length;
      // this.push();
      rowStart = ++rowEnd;

      if (rowEnd >= chunkString.length) {
        break;
      }
    }
    callback();
  }

  _flush(callback) {
    // console.log(this.#str);
    this.push(this.#str);
    // console.log(callback);
    callback();
  }
}

module.exports = LineSplitStream;
