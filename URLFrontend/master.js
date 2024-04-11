const http = require('http');
const fs = require('fs');
const path = require('path');
const express = require('express');
const cookieSession = require('cookie-session');
const socketIO = require('socket.io');

const PORT = 3000;
const baseStaticFolder = path.join(__dirname, 'static');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.json());
app.use(cookieSession({
  name: 'session',
  keys: ['keycoderr'],
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));

// Logout route
// Authentication middleware
const isAuthenticated = (req, res, next) => {
  if (req.session.user) {
    // User is authenticated, allow the request to proceed
    console.log(req.session.user);
    console.log('Authenticated');
    next();
  } else {
    // User is not authenticated, redirect to the login page
    res.redirect('/login');
  }
};


// Logout route
app.get('/logout', (req, res) => {
  // Clear the user session
  req.session = null;
  console.log('logout');
  // Serve the logout.html page
  res.sendFile(path.join(baseStaticFolder, 'login.html'));
});

// Serve the login page without authentication
app.get('/login', (req, res) => {
  res.sendFile(path.join(baseStaticFolder, 'login.html'));
});

// Handle login request
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Hash the username and password
  const hashedCredentials = username + password; // This is a simplistic hash, not recommended for production

  // Check if the hash matches the expected value
  if (hashedCredentials === 'geekcoderrlpu123') { // Example hash
    // Authenticate the user
    req.session.user = { username };
    res.status(200).json({ message: 'authenticated' });
  } else {
    res.status(401).json({ error: 'Invalid username or password' });
  }
});

// Serve static files only if authenticated
app.use(isAuthenticated, express.static(baseStaticFolder));

// Serve the index page only if authenticated
app.get('/', isAuthenticated, (req, res) => {
  res.sendFile(path.join(baseStaticFolder, 'index.html'));
});

// Socket.IO connection
io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
