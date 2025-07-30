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

app.get('/proxy', async (req, res) => {
    try {
      const response = await fetch('http://localhost:5000/', {
        headers: {
          'Accept-Encoding': 'gzip, br'
        }
      });

      const data = await response.text();
      res.send(data);
    } catch (error) {
      console.error('Error fetching from other server:', error.message);
      res.status(500).send('Error fetching data from other server');
    }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});