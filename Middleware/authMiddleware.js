const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    const authHeader =
      req.headers['authorization'] || req.headers['Authorization'];

    if (!authHeader) {
      return res
        .status(401)
        .json({ error: 'Please log in to track your parcel' });
    }

    const token = authHeader.startsWith('Bearer ')
      ? authHeader.split(' ')[1]
      : authHeader;

    if (!token) {
      return res.status(401).json({ error: 'Access denied. Token missing.' });
    }

    jwt.verify(token, process.env.JWT_TOKEN, (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: 'Invalid or expired token' });
      }

      if (decoded) {
        req.user = decoded;
        next();
      } else {
        return res.status(401).json({ error: 'Bad token structure.' });
      }
    });
  } catch (error) {
    console.error('Auth Middleware Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = authMiddleware;
