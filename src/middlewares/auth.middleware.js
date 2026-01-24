const jwt = require('jsonwebtoken');
const config = require('../config/config');

const verifyToken = (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            const error = new Error('Access denied. No token provided.');
            error.status = 401;
            throw error;
        }

        const token = authHeader.split(' ')[1];

        // Verify token
        const decoded = jwt.verify(token, config.jwt.secret);

        // Add user info to request
        req.user = decoded;

        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            error.message = 'Token has expired';
        } else if (error.name === 'JsonWebTokenError') {
            error.message = 'Invalid token';
        }
        error.status = 401;
        next(error);
    }
};

module.exports = {
    verifyToken
};
