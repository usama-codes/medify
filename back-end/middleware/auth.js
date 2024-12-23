const jwt = require('jsonwebtoken');
const JWT_SECRET = 'pharwax'; // Store this secret in your .env file

// Middleware to authenticate and get user_id from JWT token
const authenticateUser = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'Authorization token required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET); // Verify the JWT token

    console.log('Decoded Token:', decoded);  // Log the decoded token for debugging

    if (!decoded.userId) {
      return res.status(401).json({ error: 'User ID not found in token' });
    }

    req.userId = decoded.userId; // Attach userId to the request object
    next();
  } catch (err) {
    console.error('JWT verification failed:', err);  // Log the error for debugging

    // Check if it's an expired token error
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token has expired' });
    }

    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

module.exports = authenticateUser;
