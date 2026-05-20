const jwt = require('jsonwebtoken');
const config = require('../config');

// Middleware: Verify JWT token on protected routes
function verifyToken(req, res, next) {
    const header = req.headers['authorization'];

    if (!header) {
        return res.status(401).json({ error: 'No token provided' });
    }

    const token = header.startsWith('Bearer ') ? header.slice(7) : header;

    try {
        const decoded = jwt.verify(token, config.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ error: 'Invalid or expired token' });
    }
}

module.exports = { verifyToken };
