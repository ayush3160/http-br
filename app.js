const express = require('express');
const brotli = require('brotli');
const zlib = require('zlib');
const app = express();
const port = 3000;

// Middleware to compress response using Brotli
app.use((req, res, next) => {
  const acceptEncoding = req.headers['accept-encoding'] || '';
  
  if (acceptEncoding.includes('br')) {
    const originalSend = res.send;
    
    res.send = (body) => {
      const compressed = brotli.compress(Buffer.from(body));
      res.set('Content-Encoding', 'br');
      res.set('Content-Length', compressed.length);
      originalSend.call(res, compressed);
    };
  } else if (acceptEncoding.includes('gzip')) {
    const originalSend = res.send;
    
    res.send = (body) => {
      zlib.gzip(body, (err, compressed) => {
        if (err) {
          return res.status(500).send('Error compressing response');
        }
        res.set('Content-Encoding', 'gzip');
        res.set('Content-Length', compressed.length);
        originalSend.call(res, compressed);
      });
    };
  }

  next();
});

// Route to return response with Brotli encoding
app.get('/br', (req, res) => {
  const responseBody = JSON.stringify({ message: 'This is a response with Brotli encoding!' });
  res.type('application/json');
  res.send(responseBody);
});

// Route to return response with Gzip encoding
app.get('/gzip', (req, res) => {
  const responseBody = JSON.stringify({ message: 'This is a response with Gzip encoding!' });
  res.type('application/json');
  res.send(responseBody);
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});