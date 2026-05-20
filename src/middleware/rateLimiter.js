const rateLimit = require('express-rate-limit');

// General API rate limiter: max 100 requests per minute per IP
const apiLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 100,
    message: { error: 'Too many requests. Try again later.' }
});

// Stricter limiter for auth routes: max 10 attempts per minute
const authLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 10,
    message: { error: 'Too many login attempts. Try again later.' }
});

module.exports = { apiLimiter, authLimiter };
