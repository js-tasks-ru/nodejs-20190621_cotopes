const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.dataLength = 0;
    this.limit = options.limit;
  }

  _transform(chunk, encoding, callback) {
    this.dataLength += chunk.length;
    if (this.dataLength >= this.limit) {
      callback(new LimitExceededError(), chunk);
    }
    this.push(chunk);
    callback();
  }
}

module.exports = LimitSizeStream;
