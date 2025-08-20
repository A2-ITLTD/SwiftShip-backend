const roleMiddleware = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role || !allowedRoles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ error: 'Access denied. Unauthorized role.' });
    }
    next();
  };
};

module.exports = roleMiddleware;
