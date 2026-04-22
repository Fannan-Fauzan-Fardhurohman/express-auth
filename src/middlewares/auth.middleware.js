const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  // SECURITY MITIGATION: Try to get token from httpOnly cookie first, then fallback to Bearer header
  let token = req.cookies && req.cookies.token;
  
  if (!token) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    // SECURITY MITIGATION: Explicitly verify HS256 algorithm to prevent Algorithm Confusion attack
    const decoded = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
    req.user = decoded; // add user to request payload
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired.' });
    }
    return res.status(403).json({ message: 'Invalid token.' });
  }
};

module.exports = { verifyToken };
