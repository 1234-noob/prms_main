// src/swagger.ts
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Help & Support Microservice API',
            version: '1.0.0',
            description: 'API documentation for Disputes, Maintenance, and Contact modules.',
        },
        servers: [
            {
                url: 'http://localhost:3011',
                description: 'Local development server',
            },
        ],
    },
    apis: [
        './src/routes/*.ts',
        './src/controllers/*.ts',
        './src/entities/*.ts',
    ],
    //  apis: ['./src/routes/*.ts', './src/controllers/*.ts'],
};

const swaggerSpec = swaggerJsdoc(options);

export { swaggerUi, swaggerSpec };
