import dotenv from 'dotenv';
import testConfig from './test.config.js';

// Cargar variables de entorno según el ambiente
dotenv.config({
    path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env'
});

// Configuración por defecto
const defaultConfig = {
    port: process.env.PORT || 8080,
    mongoUrl: process.env.MONGODB_URI || 'mongodb://localhost:27017/pets',
    jwtSecret: process.env.JWT_SECRET || 'defaultSecret',
    cookieName: 'coderCookie'
};

// Seleccionar configuración según el ambiente
const config = process.env.NODE_ENV === 'test' ? testConfig : defaultConfig;

export default config; 