const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

function sendFile(filepath, res) {
  const file = fs.createReadStream(filepath);
  file.pipe(res);
  file.on('error', function(error) {
    if (error.code === 'ENOENT') {
      res.statusCode = 404;
      return res.end('File does not exist');
    }

    res.statusCode = 500;
    res.end('Server Error');
  });
}

const server = new http.Server();

server.on('request', async (req, res) => {
  switch (req.method) {
    case 'GET':
      if (req.url === '/favicon.ico') {
        res.writeHead(200, {'Content-Type': 'image/x-icon'} );
        res.end();
        return;
      }

      const pathname = url.parse(req.url).pathname.slice(1);
      if (path.parse(pathname).dir) {
        res.statusCode = 400;
        return res.end('Does not support directories');
      }
      const filepath = path.join(__dirname, 'files', pathname);

      sendFile(filepath, res);
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
