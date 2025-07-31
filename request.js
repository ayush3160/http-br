const axios = require('axios');
const { compressData, compressDataGzip } = require('./utils'); // Adjust the path as necessary

// The data you want to send in the body
const requestData = {
  key: 'value',
  anotherKey: 'anotherValue'
};

// Send the POST request with compressed body
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

// New makeRequest function
async function sendProxyPost() {
  try {
    const encodings = ['br', 'gzip'];
    const randomEncoding = encodings[Math.floor(Math.random() * encodings.length)];

    let compressedBody;
    if (randomEncoding === 'br') {
      compressedBody = await compressData(requestData);
    } else {
      compressedBody = await compressDataGzip(requestData);
    }

    const response = await axios.post('http://localhost:3000/proxy/post', compressedBody, {
      headers: {
        'Content-Type': 'application/json',
        'Content-Encoding': randomEncoding,
        'Accept-Encoding': 'gzip, br'
      },
      responseType: 'arraybuffer'
    });

    const responseData = response.data.toString('utf-8');
    const responseObj = JSON.parse(responseData);
    console.log('Proxy POST Response:', responseObj);
  } catch (error) {
    console.error('Error making request:', error.message);
  }
}

// Call all request functions
sendRequestBr();
sendRequestGzip();
sendRequestAcceptBr();
sendRequestAcceptGzip();
sendProxyRequestBr();
sendProxyRequestGzip();
sendRequestAcceptBr();
sendRequestAcceptGzip();
sendProxyPost();
