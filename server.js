const express = require('express');
const compression = require('compression');
const zlib = require('zlib');
const app = express();

const port = 5000;

app.use(compression({ threshold: 0 }));

app.get('/', (req, res) => {
  const responseBody = JSON.stringify({ message: 'This is a compressed response from server 2!', timestamp: new Date() });
  res.type('application/json');
  res.send(responseBody);
});

app.post('/', compression({ threshold: 0 }), async (req, res) => {
  let chunks = [];
  req.on('data', chunk => {
    chunks.push(chunk);
  });

  req.on('end', async () => {
    let buffer = Buffer.concat(chunks);
    let encoding = req.headers['content-encoding'];
    let decoded;

    try {
      if (encoding === 'br') {
        decoded = zlib.brotliDecompressSync(buffer).toString();
      } else if (encoding === 'gzip') {
        decoded = zlib.gunzipSync(buffer).toString();
      } else {
        decoded = buffer.toString();
      }

      let bodyObj = {};
      try {
        bodyObj = JSON.parse(decoded);
      } catch (e) {
        // If not JSON, just wrap as message
        bodyObj = { message: decoded };
      }
      bodyObj.timestamp = new Date();

      const responseBody = JSON.stringify(bodyObj);
      res.type('application/json');
      res.send(responseBody);
    } catch (err) {
      res.status(400).json({ error: 'Failed to decode body', details: err.message });
    }
  });
});

const server = app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});

function shutdown(signal) {
    console.log(`Received ${signal}. Shutting down gracefully...`);
    server.close(() => {
        console.log('Server closed.');
        process.exit(0);
    });
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
