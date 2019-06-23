const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const LimitSizeStream = require('./LimitSizeStream');

const limitStream = new LimitSizeStream({limit: 1024});

function writeFile(filePath, req, res) {
  const file = fs.createWriteStream(filePath);
  limitStream.on('error', (error)=>{
    res.statusCode = 413;
    res.end('Limit size exceeded');
  });

  req.on('error', function(error) {
    res.statusCode = 500;
    res.end('Server Error');
  });

  req.on('close', function(error) {
    fs.unlink(filePath, (err)=>console.error(err));
  });

  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      req
          .pipe(limitStream)
          .pipe(file)
          .on('finish', ()=>{
            res.statusCode = 200;
            res.end();
          });
    } else {
      res.statusCode = 409;
      res.end('File already exists');
    }
  });
}

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);
  if (path.parse(pathname).dir) {
    res.statusCode = 400;
    return res.end('Does not support directories');
  }

  switch (req.method) {
    case 'POST':
      writeFile(filepath, req, res);
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
