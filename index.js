require('dotenv').config();
const express = require('express');
const dbConfig = require('./Config/Db');
const http = require('http');
const { Server } = require('socket.io');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const sanitizeHtml = require('sanitize-html');
const cors = require('cors');
const path = require('path');
const logger = require('./Config/logger');
const router = require('./Routes');

// --------------------
// Connect to database
// --------------------
dbConfig();

// --------------------
// App setup
// --------------------
const app = express();
const port = process.env.PORT || 4000;

// --------------------
// Security & performance middlewares
// --------------------
app.use(helmet());
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

// --------------------
// CORS configuration
// --------------------
const allowedOrigins = [
  'https://swift.commercialtirerepairllc.com',
  'http://localhost:5173',
  'https://swiftship-ac10.onrender.com',
  'https://cargologisticscompany.com',
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};
app.use(cors(corsOptions));

// --------------------
// API routes first
// --------------------
app.use(router);

// --------------------
// Create HTTP + Socket.IO server
// --------------------
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

io.on('connection', (socket) => {
  logger.info(`🔌 User connected: ${socket.id}`);

  socket.on('disconnect', () => {
    logger.info(`❌ User disconnected: ${socket.id}`);
  });
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
