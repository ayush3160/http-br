# HTTP Compression Example

This project demonstrates response compression in an Express.js application using the `compression` middleware. It includes two servers: one that serves compressed content and another that acts as a proxy.

## Prerequisites

- Node.js
- npm

## Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```

## Running the Servers

1.  Start the main server (`app.js`):
    ```bash
    node app.js
    ```
    This server will be running at `http://localhost:3000`.

2.  Start the second server (`server.js`):
    ```bash
    node server.js
    ```
    This server will be running at `http://localhost:5000`.

## Testing with cURL

### Test Compression on the Main Server

To test Brotli compression:
```bash
curl -H "Accept-Encoding: br" -i http://localhost:3000/
```

To test Gzip compression:
```bash
curl -H "Accept-Encoding: gzip" -i http://localhost:3000/
```

### Test Compression on the Second Server

To test Brotli compression:
```bash
curl -H "Accept-Encoding: br" -i http://localhost:5000/
```

To test Gzip compression:
```bash
curl -H "Accept-Encoding: gzip" -i http://localhost:5000/
```

### Test the Proxy

The proxy endpoint on the main server fetches content from the second server and forwards it.

To test the proxy with Brotli:
```bash
curl -H "Accept-Encoding: br" -i http://localhost:3000/proxy
```

To test the proxy with Gzip:
```bash
curl -H "Accept-Encoding: gzip" -i http://localhost:3000/proxy
```
