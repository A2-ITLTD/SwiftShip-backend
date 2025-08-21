const express = require('express');
const router = express.Router();
const apiRouter = require('./Api/Index');

// ✅ Mount all API routes under /api/v1
router.use(
  '/',
  (req, res, next) => {
    console.log(
      '✅ SwiftShip backend is working!',
      req.method,
      req.originalUrl
    );
    next();
  },
  apiRouter
);

// ✅ Catch-all 404 for undefined API routes
router.use((req, res) => {
  res.status(404).json({ error: 'Page not found' });
});

module.exports = router;
