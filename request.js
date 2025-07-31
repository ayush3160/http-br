const axios = require('axios');
const iltorb = require('iltorb');

// The data you want to send in the body
const requestData = {
  key: 'value',
  anotherKey: 'anotherValue'
};

// Compress the data using Brotli
const compressData = (data) => {
  return new Promise((resolve, reject) => {
    iltorb.compress(Buffer.from(JSON.stringify(data)), (err, compressed) => {
      if (err) reject(err);
      else resolve(compressed);
    });
  });
};

// Send the POST request with compressed body
const zlib = require('zlib');

// 1. Content-Encoding: br (Brotli)
const sendRequestBr = async () => {
  try {
    const compressedData = await compressData(requestData);
    const response = await axios.post('http://localhost:3000/', compressedData, {
      headers: {
        'Content-Encoding': 'br',
        'Content-Type': 'application/json'
      }
    });
    console.log('Response (Content-Encoding: br):', response.data);
  } catch (error) {
    console.error('Error sending Brotli request:', error);
  }
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

const sendRequestGzip = async () => {
  try {
    const compressedData = await compressDataGzip(requestData);
    const response = await axios.post('http://localhost:3000/', compressedData, {
      headers: {
        'Content-Encoding': 'gzip',
        'Content-Type': 'application/json'
      }
    });
    console.log('Response (Content-Encoding: gzip):', response.data);
  } catch (error) {
    console.error('Error sending gzip request:', error);
  }
};

// 3. Accept-Encoding: br
const sendRequestAcceptBr = async () => {
  try {
    const response = await axios.post('http://localhost:3000/', requestData, {
      headers: {
        'Accept-Encoding': 'br',
        'Content-Type': 'application/json'
      }
    });
    console.log('Response (Accept-Encoding: br):', response.data);
  } catch (error) {
    console.error('Error sending Accept-Encoding br request:', error);
  }
};

// 4. Accept-Encoding: gzip
const sendRequestAcceptGzip = async () => {
  try {
    const response = await axios.post('http://localhost:3000/', requestData, {
      headers: {
        'Accept-Encoding': 'gzip',
        'Content-Type': 'application/json'
      }
    });
    console.log('Response (Accept-Encoding: gzip):', response.data);
  } catch (error) {
    console.error('Error sending Accept-Encoding gzip request:', error);
  }
};

// Additional requests to /proxy route

const sendProxyRequestBr = async () => {
  try {
    const compressedData = await compressData(requestData);
    const response = await axios.post('http://localhost:3000/proxy', compressedData, {
      headers: {
        'Content-Encoding': 'br',
        'Content-Type': 'application/json'
      }
    });
    console.log('Proxy Response (Content-Encoding: br):', response.data);
  } catch (error) {
    console.error('Error sending Brotli proxy request:', error);
  }
};

const sendProxyRequestGzip = async () => {
  try {
    const compressedData = await compressDataGzip(requestData);
    const response = await axios.post('http://localhost:3000/proxy', compressedData, {
      headers: {
        'Content-Encoding': 'gzip',
        'Content-Type': 'application/json'
      }
    });
    console.log('Proxy Response (Content-Encoding: gzip):', response.data);
  } catch (error) {
    console.error('Error sending gzip proxy request:', error);
  }
};

sendRequestBr();
sendRequestGzip();
sendRequestAcceptBr();
sendRequestAcceptGzip();
sendProxyRequestBr();
sendProxyRequestGzip();
sendRequestAcceptBr();
sendRequestAcceptGzip();
