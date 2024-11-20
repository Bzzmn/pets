// src/utils/errorHandler.js

// Diccionario de errores comunes
export const ERROR_MESSAGES = {
    USER_NOT_FOUND: "User not found",
    PET_NOT_FOUND: "Pet not found",
    INCOMPLETE_VALUES: "Incomplete values",
    USER_ALREADY_EXISTS: "User already exists",
    INCORRECT_PASSWORD: "Incorrect password",
    PET_ALREADY_ADOPTED: "Pet is already adopted"
};

export const handleError = (error, res) => {
    const { statusCode, message } = error;
    const userMessage = ERROR_MESSAGES[message] || message || 'Internal Server Error';
    
    res.status(statusCode || 500).send({ status: "error", error: userMessage });
};
