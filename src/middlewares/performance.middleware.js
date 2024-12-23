import { logger } from '../utils/logger.js';

export const performanceMonitor = (req, res, next) => {
    const start = process.hrtime();

    res.on('finish', () => {
        const [seconds, nanoseconds] = process.hrtime(start);
        const responseTime = seconds * 1000 + nanoseconds / 1000000; // Convertir a milisegundos

        if (responseTime > 3000) { // Advertencia si la respuesta tarda más de 3 segundos
            logger.warning(`Endpoint lento detectado: ${req.method} ${req.url} - ${responseTime.toFixed(2)}ms`);
        }

        logger.http(`${req.method} ${req.url} - ${responseTime.toFixed(2)}ms`);
    });

    next();
}; 