const express = require('express');
const compression = require('compression');
const app = express();

const port = 5000;

app.use(compression({ threshold: 0 }));

app.get('/', (req, res) => {
  const responseBody = JSON.stringify({ message: 'This is a compressed response from server 2!', timestamp: new Date() });
  res.type('application/json');
  res.send(responseBody);
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});

function shutdown(signal) {
    console.log(`Received ${signal}. Shutting down gracefully...`);
    process.exit(0);
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
