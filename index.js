require('dotenv').config();
const express = require('express');
const dbConfig = require('./Config/Db');
const http = require('http');
const { Server } = require('socket.io');
const router = require('./Routes');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const sanitizeHtml = require('sanitize-html');
const winston = require('winston');
const cors = require('cors');
const path = require('path');
const logger = require('./Config/logger');

// --------------------
// Connect to database
// --------------------
dbConfig();

// --------------------
// App setup
// --------------------
const app = express();
const port = process.env.PORT || 3000;

// Security & performance middlewares
app.use(helmet());
app.use(
  cors({
    origin:'https://swiftship-70l3.onrender.com',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  })
);
app.use(compression());
app.use(express.json({ limit: '10kb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Sanitize incoming data
app.use((req, res, next) => {
  if (req.body) {
    for (const key in req.body) {
      if (typeof req.body[key] === 'string') {
        req.body[key] = sanitizeHtml(req.body[key]);
      }
    }
  }
  next();
});




app.use(router);

const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));

// SPA catch-all route (for client-side routing)
app.get('/', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

// --------------------
// Create HTTP + Socket.IO server
// --------------------
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  logger.info(`🔌 User connected: ${socket.id}`);

  socket.on('disconnect', () => {
    logger.info(`❌ User disconnected: ${socket.id}`);
  });
});

// --------------------
// Default route
// --------------------
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'SwiftShip API is running 🚀' });
});

// --------------------
// Start server
// --------------------
server.listen(port, () => {
  logger.info(
    `🚀 Server running on port ${port} in ${
      process.env.NODE_ENV || 'development'
    } mode`
  );
});
