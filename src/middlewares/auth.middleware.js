import jwt from 'jsonwebtoken';
import { logger } from '../utils/logger.js';
import config from '../config/config.js';

export const authMiddleware = (req, res, next) => {
    try {
        const token = req.cookies[config.cookieName];
        
        if (!token) {
            logger.warning('Authentication attempt without token');
            return res.status(401).send({ 
                status: 'error', 
                error: 'No token provided' 
            });
        }

        try {
            const user = jwt.verify(token, config.jwtSecret);
            req.user = user;
            logger.info(`User authenticated: ${user.email}`);
            next();
        } catch (verifyError) {
            logger.error('Token verification failed:', verifyError);
            return res.status(401).send({ 
                status: 'error', 
                error: 'Invalid token' 
            });
        }
    } catch (error) {
        logger.error('Authentication error:', error);
        res.status(500).send({ 
            status: 'error', 
            error: 'Internal server error' 
        });
    }
};

export const checkRole = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            logger.warning('Role check without user');
            return res.status(401).send({ 
                status: 'error', 
                error: 'No user found' 
            });
        }

        if (!roles.includes(req.user.role)) {
            logger.warning(`Access denied for user ${req.user.email} with role ${req.user.role}`);
            return res.status(403).send({ 
                status: 'error', 
                error: 'Insufficient permissions' 
            });
        }

        logger.info(`Role check passed for user ${req.user.email}`);
        next();
    };
}; 