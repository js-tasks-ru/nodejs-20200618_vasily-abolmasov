const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const LimitSizeStream = require('./LimitSizeStream');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);
  const bytesLimit = 1000000;

  function return413() {
    fs.unlinkSync(filepath);
    res.statusCode = 413;
    res.end('413');
  }

  function deleteIfFileExist() {
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
    }
  }

  function return500() {
    res.statusCode = 500;
    deleteIfFileExist();
    res.end('500');
  }

  switch (req.method) {
    case 'POST':
      if (req.url.indexOf('/', 1) >= 0) {
        res.statusCode = 400;
        res.end('Subfolders are not supported');
        return;
      }

      if (fs.existsSync(filepath)) {
        res.statusCode = 409;
        res.end('Already exists');
        return;
      }

      const limitStream = new LimitSizeStream({limit: bytesLimit} );
      const outStream = fs.createWriteStream(filepath);
      req.pipe(limitStream).pipe(outStream);

      limitStream.on('error', (err) => {
        return413();
      });

      req.on('close', (err) => {
        if (!req.complete) {
          deleteIfFileExist();
        }
      });

      req.on('data', (chunk) => {
        try {
          limitStream.write(chunk);
        } catch (e) {
          return500();
        }
      });

      req.on('end', (chunk) => {
        if (chunk) {
          try {
            limitStream.write(chunk);
            res.statusCode = 201;
            res.end();
            return;
          } catch (e) {
            return500();
            return;
          }
        }
        res.statusCode = 201;
        res.end();
      });

      req.on('error', (chunk) => {
        if (chunk) {
          try {
            limitStream.write(chunk);
          } catch (e) {
            return500();
            return;
          }
        }
        res.statusCode = 500;
        res.end();
      });

      // const limitSizeStream = new LimitSizeStream({limit: bytesLimit});


      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
