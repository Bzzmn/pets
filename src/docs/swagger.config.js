import swaggerJSDoc from 'swagger-jsdoc';

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API de Adopción de Mascotas',
            version: '1.0.0',
            description: 'API para gestionar adopciones de mascotas'
        },
        servers: [
            {
                url: 'http://localhost:8080',
                description: 'Servidor local'
            }
        ]
    },
    apis: [
        './src/docs/schemas/**/*.yaml',
        './src/docs/paths/**/*.yaml',
        './src/routes/*.js'
    ]
};

export const specs = swaggerJSDoc(swaggerOptions); 