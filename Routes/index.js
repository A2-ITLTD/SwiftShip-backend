const express = require('express');
const router = express.Router();
const apiRouter = require('./Api/Index');

// ✅ Health check / backend test route
router.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: '✅ SwiftShip backend is working!',
  });
});

// ✅ Middleware to log all API requests
router.use(
  'api/v1',
  (req, res, next) => {
    console.log('✅ API request:', req.method, req.originalUrl);
    next();
  },
  apiRouter
);

// ✅ Catch-all 404 for undefined API routes
router.use('api/v1', (req, res) => {
  res.status(404).json({ error: 'API route not found' });
});

module.exports = router;
