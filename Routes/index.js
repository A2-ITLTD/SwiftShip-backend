const express = require('express');
const router = express.Router();
const apiRouter = require('./Api/Index');

// ✅ Mount all API routes under /api/v1
router.use(
  '/api/v1',
  (req, res, next) => {
    console.log('➡️ API route hit:', req.method, req.originalUrl);
    next();
  },
  apiRouter
);

// ✅ Health check / backend test route
router.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: '✅ SwiftShip backend is working!',
  });
});

// ✅ Catch-all 404 for undefined API routes
router.use((req, res) => {
  res.status(404).json({ error: 'Page not found' });
});

module.exports = router;
