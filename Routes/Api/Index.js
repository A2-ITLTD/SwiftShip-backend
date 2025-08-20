const express = require('express');
const router = express.Router();
const authRouter = require('./Auth');
const trackRouter = require('./order.js');

router.use('/auth', authRouter);
router.use('/order', trackRouter);

module.exports = router;
