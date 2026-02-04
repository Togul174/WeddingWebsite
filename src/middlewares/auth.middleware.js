const requireAuth = (req, res, next) => {
  if (req.session && req.session.user) {
    next();
  } else {
    res.status(401).json({
      success: false,
      error: 'Требуется авторизация'
    });
  }
};

module.exports = { requireAuth };