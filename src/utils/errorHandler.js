// src/utils/errorHandler.js

import { logger } from './logger.js';

// Clase personalizada para errores de la aplicación
export class CustomError extends Error {
    constructor(message, statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
        this.status = statusCode >= 400 && statusCode < 500 ? 'fail' : 'error';
    }
}

// Diccionario de errores comunes
export const ERROR_DICTIONARY = {
    // Errores de Usuario
    USER_NOT_FOUND: {
        message: "User not found",
        statusCode: 404
    },
    USER_ALREADY_EXISTS: {
        message: "User already exists with this email",
        statusCode: 400
    },
    INVALID_PASSWORD: {
        message: "Password must be at least 8 characters long and contain both letters and numbers",
        statusCode: 400
    },
    INVALID_EMAIL: {
        message: "Invalid email format",
        statusCode: 400
    },
    MISSING_USER_DATA: {
        message: "Missing required user data",
        statusCode: 400
    },

    // Errores de Mascota
    PET_NOT_FOUND: {
        message: "Pet not found",
        statusCode: 404
    },
    PET_ALREADY_ADOPTED: {
        message: "This pet is already adopted",
        statusCode: 400
    },
    INVALID_PET_AGE: {
        message: "Invalid pet birth date",
        statusCode: 400
    },
    MISSING_PET_DATA: {
        message: "Missing required pet data",
        statusCode: 400
    },
    INVALID_PET_SPECIES: {
        message: "Invalid pet species",
        statusCode: 400
    },

    // Errores Generales
    UNAUTHORIZED: {
        message: "Unauthorized access",
        statusCode: 401
    },
    FORBIDDEN: {
        message: "Forbidden action",
        statusCode: 403
    },
    SERVER_ERROR: {
        message: "Internal server error",
        statusCode: 500
    }
};

// Función helper para crear errores
export const createError = (errorType) => {
    const error = ERROR_DICTIONARY[errorType];
    if (!error) {
        return new CustomError('Unknown error', 500);
    }
    return new CustomError(error.message, error.statusCode);
};

// Middleware para manejo de errores
export const errorHandler = (err, req, res, next) => {
    // Log del error
    if (err.statusCode >= 500) {
        logger.error(`Error: ${err.message}\nStack: ${err.stack}`);
    } else {
        logger.warning(`Client Error: ${err.message}`);
    }

    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    const error = {
        status: 'error',
        statusCode,
        message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    };

    res.status(statusCode).json(error);
};
