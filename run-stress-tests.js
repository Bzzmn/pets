import { spawn, execSync } from 'child_process';
import mongoose from 'mongoose';
import { createHash } from './src/utils/index.js';
import userModel from './src/dao/models/User.js';
import config from './src/config/config.js';

// Función para verificar si un puerto está en uso
const isPortInUse = async (port) => {
    try {
        const pid = execSync(`lsof -t -i:${port}`).toString().trim();
        return !!pid;
    } catch (error) {
        return false;
    }
};

// Función para matar el proceso que está usando el puerto
const killProcessOnPort = async (port) => {
    try {
        execSync(`lsof -t -i:${port} | xargs kill -9`);
        console.log(`Successfully killed process on port ${port}`);
    } catch (error) {
        console.log('No process was running on port', port);
    }
};

const setupTestData = async () => {
    try {
        console.log('Connecting to MongoDB...');
        console.log('Attempting to connect to:', config.mongoUrl);
        
        // Configuración más robusta para MongoDB
        mongoose.set('bufferCommands', false); // Deshabilitar buffering
        await mongoose.connect(config.mongoUrl, {
            serverSelectionTimeoutMS: 60000, // 60 segundos
            socketTimeoutMS: 60000,
            connectTimeoutMS: 60000,
            maxPoolSize: 100,
            minPoolSize: 10,
            maxIdleTimeMS: 60000,
            waitQueueTimeoutMS: 30000,
            heartbeatFrequencyMS: 5000
        });

        // Verificar la conexión explícitamente
        await mongoose.connection.db.admin().ping();
        console.log('MongoDB connected successfully - Database ping successful');

        console.log('Setting up test data...');
        console.log('Cleaning existing data...');
        await userModel.deleteMany({});

        console.log('Creating admin user...');
        const adminUser = {
            first_name: 'Admin',
            last_name: 'Test',
            email: 'admin@test.com',
            password: await createHash('test123'),
            role: 'admin'
        };

        await userModel.create(adminUser);
        console.log('Test data setup completed - Admin user created:', adminUser.email);

    } catch (error) {
        console.error('Error setting up test data:', error);
        throw error;
    }
};

const runServer = () => {
    return new Promise(async (resolve, reject) => {
        const port = config.port || 8080;

        // Verificar y limpiar el puerto si está en uso
        if (await isPortInUse(port)) {
            console.log(`Port ${port} is in use. Cleaning up...`);
            await killProcessOnPort(port);
            // Esperar un momento para que el puerto se libere
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        const server = spawn('node', ['src/app.js'], {
            env: { ...process.env, NODE_ENV: 'test' }
        });

        server.stdout.on('data', (data) => {
            console.log(`Server: ${data}`);
            if (data.includes('Server listening on port')) {
                resolve(server);
            }
        });

        server.stderr.on('data', (data) => {
            console.error(`Server Error: ${data}`);
        });

        server.on('error', (error) => {
            console.error('Failed to start server:', error);
            reject(error);
        });

        // Timeout para evitar que se quede esperando indefinidamente
        setTimeout(() => {
            reject(new Error('Server startup timeout'));
        }, 30000);
    });
};

const runArtillery = () => {
    return new Promise((resolve, reject) => {
        const artillery = spawn('artillery', ['run', 'artillery/stress.yml'], {
            stdio: 'inherit'
        });

        artillery.on('close', (code) => {
            if (code === 0) {
                resolve();
            } else {
                reject(new Error(`Artillery exited with code ${code}`));
            }
        });
    });
};

const cleanup = async (server) => {
    console.log('Cleaning up...');
    try {
        if (mongoose.connection.readyState === 1) {
            await mongoose.disconnect();
        }
        if (server) {
            server.kill();
        }
        // Asegurar que el puerto quede libre
        await killProcessOnPort(config.port || 8080);
    } catch (error) {
        console.error('Error during cleanup:', error);
    }
};

const main = async () => {
    let server;
    try {
        await setupTestData();
        server = await runServer();
        
        console.log('Waiting for server to stabilize...');
        await new Promise(resolve => setTimeout(resolve, 10000));
        
        console.log('Starting Artillery tests...');
        await runArtillery();
    } catch (error) {
        console.error('Test execution failed:', error);
        process.exit(1);
    } finally {
        await cleanup(server);
    }
};

// Manejar señales de terminación
process.on('SIGINT', async () => {
    console.log('Received SIGINT. Cleaning up...');
    await cleanup();
    process.exit(0);
});

main(); 