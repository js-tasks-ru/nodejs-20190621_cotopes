const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);
  if (path.parse(pathname).dir) {
    res.statusCode = 400;
    return res.end('Does not support directories');
  }
  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'DELETE':
      fs.unlink(filepath, (err) => {
        if (err){
          if (err.code === 'ENOENT'){
            res.statusCode = 404;
            return res.end('File does not exist')
          }
          res.statusCode = 500;
          return res.end('Server error')
        }
        res.statusCode = 200;
        res.end('File deleted')
      });
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
