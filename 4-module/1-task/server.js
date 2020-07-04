const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  this.return404 = function(message = null) {
    res.statusCode = 404;
    res.end(message);
  };

  switch (req.method) {
    case 'GET':
      try {
        if (req.url.indexOf('/', 1) >= 0) {
          console.log(400);
          res.statusCode = 400;
          res.end('Subfolders are not supported');
          return;
        }

        if (!fs.existsSync(filepath)) {
          res.statusCode = 404;
          res.end('not found');
          return;
        }

        const readStream = fs.createReadStream(filepath);
        res.writeHead(200);
        readStream.pipe(res);

        break;
      } catch (err) {
        res.statusCode = 500;
        res.end('Error');
      }
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
