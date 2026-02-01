// Swagger configuration for Orvio Backend
const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Orvio Backend API',
      version: '1.0.0',
      description:
        'API documentation for Orvio Backend with Swagger UI and dummy request/response samples for easy endpoint testing.',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Local server',
      },
    ],
    components: {
      securitySchemes: {
        DeviceToken: {
          type: 'apiKey',
          in: 'header',
          name: 'X-Device-Token',
          description: 'Device authentication token',
        },
        AdminToken: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Admin/Sysadmin JWT token (Authorization: Bearer <token>)',
        },
      },
    },
  },
  // Path to the API docs with JSDoc comments
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
