const zlib = require('zlib');
const iltorb = require('iltorb');

// Compress the data using Brotli
const compressData = (data) => {
  return new Promise((resolve, reject) => {
    iltorb.compress(Buffer.from(JSON.stringify(data)), (err, compressed) => {
      if (err) reject(err);
      else resolve(compressed);
    });
  });
};

// 2. Content-Encoding: gzip
const compressDataGzip = (data) => {
  return new Promise((resolve, reject) => {
    zlib.gzip(Buffer.from(JSON.stringify(data)), (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

module.exports = {
  compressData,
  compressDataGzip
};
