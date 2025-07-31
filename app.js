const express = require('express');
const compression = require('compression');
const zlib = require('zlib');
const app = express();
const port = 3000;

app.get('/', compression({ threshold: 0 }), (req, res) => {
  const responseBody = JSON.stringify({ message: 'This is a compressed response!', timestamp: new Date() });
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

app.get('/proxy', async (req, res) => {
    try {
      const encodings = ['br', 'gzip'];
      const randomEncoding = encodings[Math.floor(Math.random() * encodings.length)];

      const response = await fetch('http://localhost:5000/', {
        headers: {
          'Accept-Encoding': randomEncoding
        }
      });

      const data = await response.text();
      res.send(data);
    } catch (error) {
      console.error('Error fetching from other server:', error.message);
      res.status(500).send('Error fetching data from other server');
    }
});

app.post('/proxy', compression({ threshold: 0 }), async (req, res) => {
  let chunks = [];
  req.on('data', chunk => {
    chunks.push(chunk);
  });

  req.on('end', async () => {
    let buffer = Buffer.concat(chunks);
    let encoding = req.headers['content-encoding'];
    let decodedRequestBody;

    try {
      if (encoding === 'br') {
        decodedRequestBody = zlib.brotliDecompressSync(buffer).toString();
      } else if (encoding === 'gzip') {
        decodedRequestBody = zlib.gunzipSync(buffer).toString();
      } else {
        decodedRequestBody = buffer.toString();
      }

      let requestBodyObj = {};
      try {
        requestBodyObj = JSON.parse(decodedRequestBody);
      } catch (e) {
        requestBodyObj = { message: decodedRequestBody };
      }

      // Randomly pick between 'br' and 'gzip'
      const encodings = ['br', 'gzip'];
      const randomEncoding = encodings[Math.floor(Math.random() * encodings.length)];

      const serverResponse = await fetch('http://localhost:5000/', {
        headers: {
          'Accept-Encoding': randomEncoding
        }
      });
      const serverDataText = await serverResponse.text();
      const serverDataObj = JSON.parse(serverDataText);

      const combinedData = { ...requestBodyObj, ...serverDataObj, timestamp: new Date() };

      const responseBody = JSON.stringify(combinedData);
      res.type('application/json');
      res.send(responseBody);
    } catch (err) {
      res.status(400).json({ error: 'Failed to process request', details: err.message });
    }
  });
});

app.post('/proxy/post', async (req, res) => {
  try {
    const requestBody = { message: 'This is a test from the proxy/post route', from: 'app.js' };
    const requestBodyString = JSON.stringify(requestBody);

    const encodings = ['br', 'gzip'];
    const randomEncoding = encodings[Math.floor(Math.random() * encodings.length)];

    let compressedBody;
    if (randomEncoding === 'br') {
      compressedBody = zlib.brotliCompressSync(Buffer.from(requestBodyString));
    } else {
      compressedBody = zlib.gzipSync(Buffer.from(requestBodyString));
    }

    const serverResponse = await fetch('http://localhost:5000/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Encoding': randomEncoding,
        'Accept-Encoding': 'gzip, br'
      },
      body: compressedBody
    });

    const responseData = await serverResponse.text();
    
    for (const [key, value] of serverResponse.headers.entries()) {
        if (key.toLowerCase() !== 'transfer-encoding' && key.toLowerCase() !== 'connection') {
             res.setHeader(key, value);
        }
    }

    res.status(serverResponse.status).send(responseData);

  } catch (error) {
    console.error('Error in /proxy/post route:', error.message);
    res.status(500).send('Error processing request in proxy');
  }
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

