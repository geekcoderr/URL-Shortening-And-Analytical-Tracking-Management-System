const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const baseStaticFolder = path.join(__dirname, 'static');

const server = http.createServer((req, res) => {
  // Get the normalized path by resolving against the baseStaticFolder
  const normalizedPath = path.normalize(req.url);
  let filePath = path.join(baseStaticFolder, normalizedPath);

  // Check if the requested file is for the favicon
  if (filePath === path.join(baseStaticFolder, '/favicon.ico')) {
    filePath = path.join(__dirname, 'favicon.ico');
  }

  // Check if the requested file is within the baseStaticFolder
  if (!filePath.startsWith(baseStaticFolder + path.sep)) {
    res.writeHead(403, { 'Content-Type': 'text/html' });
    res.end('<h1>403 Forbidden</h1>');
    return;
  }

  // Check if the requested file exists
  fs.exists(filePath, exists => {
    if (!exists) {
      res.writeHead(404, { 'Content-Type': 'text/html' });
      res.end('<h1>404 Not Found</h1>');
      return;
    }

    // If the requested path is a directory, append '/index.html' to the path
    if (fs.statSync(filePath).isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    }

    // Read the file and serve it
    fs.readFile(filePath, (err, content) => {
      if (err) {
        res.writeHead(500);
        res.end(`Server Error: ${err.code}`);
        return;
      }

      // Determine content type based on file extension
      const contentType = getContentType(filePath);
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    });
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Helper function to determine content type based on file extension
function getContentType(filePath) {
  const extname = path.extname(filePath);
  switch (extname) {
    case '.html':
      return 'text/html';
    case '.css':
      return 'text/css';
    case '.js':
      return 'text/javascript';
    case '.png':
      return 'image/png';
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    default:
      return 'application/octet-stream';
  }
};

// Handle process termination to close the server
process.on('SIGINT', () => {
  console.log('Server shutting down...');
  server.close(() => {
    console.log('Server closed.');
    process.exit(0);
  });
});
