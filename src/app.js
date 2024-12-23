// src/app.js

import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import usersRouter from './routes/users.router.js';
import petsRouter from './routes/pets.router.js';
import adoptionsRouter from './routes/adoption.router.js';
import sessionsRouter from './routes/sessions.router.js';
import mocksRouter from './routes/mocks.router.js';
import { errorHandler } from './utils/errorHandler.js';
import { logger, requestLogger } from './utils/logger.js';
import { performanceMonitor } from './middlewares/performance.middleware.js';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import { specs } from './docs/swagger.config.js';
import config from './config/config.js';

dotenv.config();

const app = express();

// Conexión a MongoDB solo si no estamos en test
if (process.env.NODE_ENV !== 'test') {
    mongoose.connect(config.mongoUrl)
        .then(() => logger.info('Connected to MongoDB'))
        .catch(error => logger.error(`Error connecting to MongoDB: ${error}`));
}

app.use(express.json());
app.use(cookieParser());
app.use(requestLogger);
app.use(performanceMonitor);

// Endpoint de prueba para logger
app.get('/loggerTest', (req, res) => {
    logger.debug('Prueba de log nivel debug');
    logger.http('Prueba de log nivel http');
    logger.info('Prueba de log nivel info');
    logger.warning('Prueba de log nivel warning');
    logger.error('Prueba de log nivel error');
    logger.fatal('Prueba de log nivel fatal');
    res.send({ status: 'success', message: 'Prueba de logs ejecutada' });
});

// Rutas
app.use('/api/users', usersRouter);
app.use('/api/pets', petsRouter);
app.use('/api/adoptions', adoptionsRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/api/mocks', mocksRouter);

// Documentación Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Manejo de rutas no encontradas
app.use('*', (req, res) => {
    logger.warning(`Intento de acceso a ruta no existente: ${req.originalUrl}`);
    res.status(404).json({
        status: 'error',
        message: 'Route not found'
    });
});

// Middleware de manejo de errores
app.use((err, req, res, next) => {
    logger.error(`Error: ${err.message}`);
    errorHandler(err, req, res, next);
});

// Modificar para que retorne el servidor
const server = app.listen(config.port, () => {
    console.log('------------------------------------------');
    logger.info(`Server listening on port ${config.port}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
    console.log(`MongoDB URI: ${config.mongoUrl}`);
    console.log('------------------------------------------');
});

export { app, server };
    