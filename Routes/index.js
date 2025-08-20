const express = require('express');
const router = express.Router();
const apiRouter = require('./Api/Index');

// Mount API routes at /api
router.use('/api/v1', apiRouter);

// Catch-all 404 for API
router.use((req, res) => {
  res.status(404).json({ error: 'Page not found' });
});

module.exports = router;
