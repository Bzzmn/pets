import winston from 'winston';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración de niveles personalizados
const customLevelsOptions = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5
    },
    colors: {
        fatal: 'red',
        error: 'magenta',
        warning: 'yellow',
        info: 'blue',
        http: 'green',
        debug: 'white'
    }
};

// Formato personalizado para los logs
const customFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(({ timestamp, level, message }) => {
        return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    })
);

// Logger para desarrollo
const developmentLogger = winston.createLogger({
    levels: customLevelsOptions.levels,
    transports: [
        new winston.transports.Console({
            level: 'debug',
            format: winston.format.combine(
                winston.format.colorize({ colors: customLevelsOptions.colors }),
                customFormat
            )
        }),
        new winston.transports.File({
            filename: path.join(__dirname, '../logs/errors.log'),
            level: 'error',
            format: customFormat
        })
    ]
});

// Logger para producción
const productionLogger = winston.createLogger({
    levels: customLevelsOptions.levels,
    transports: [
        new winston.transports.Console({
            level: 'info',
            format: winston.format.combine(
                winston.format.colorize({ colors: customLevelsOptions.colors }),
                customFormat
            )
        }),
        new winston.transports.File({
            filename: path.join(__dirname, '../logs/errors.log'),
            level: 'error',
            format: customFormat
        })
    ]
});

// Seleccionar el logger según el entorno
export const logger = process.env.NODE_ENV === 'production' 
    ? productionLogger 
    : developmentLogger;

// Middleware para loguear requests HTTP
export const requestLogger = (req, res, next) => {
    logger.http(`${req.method} en ${req.url}`);
    next();
}; 