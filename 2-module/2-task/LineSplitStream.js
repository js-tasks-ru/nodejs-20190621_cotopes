const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.restLine = '';
    this.separator = options.separator || os.EOL;
  }

  _transform(chunk, encoding, callback) {
    const lines = (this.restLine + chunk.toString()).split(this.separator);

    if (lines[lines.length - 1] === '') {
      this.restLine = '';
    } else {
      this.restLine = lines.pop();
    }

    for (const line of lines) {
      this.push(line);
    }

    callback();
  }

  _flush(callback) {
    this.push(this.restLine);
    callback();
  }
}

module.exports = LineSplitStream;
