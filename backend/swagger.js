const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'SaadhanaBoard API',
      version: '1.0.0',
      description: 'API documentation for the SaadhanaBoard spiritual productivity application',
    },
    servers: [
      {
        url: 'http://localhost:3004/api',
        description: 'Development server',
      },
      {
        url: 'https://your-production-url.com/api',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'User ID',
            },
            email: {
              type: 'string',
              description: 'User email',
            },
            displayName: {
              type: 'string',
              description: 'User display name',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'User creation timestamp',
            },
          },
        },
        AuthResponse: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Response message',
            },
            user: {
              $ref: '#/components/schemas/User',
            },
            token: {
              type: 'string',
              description: 'JWT token',
            },
          },
        },
        Profile: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Profile ID',
            },
            userId: {
              type: 'string',
              description: 'Associated user ID',
            },
            bio: {
              type: 'string',
              description: 'User biography',
            },
            avatar: {
              type: 'string',
              description: 'Avatar URL',
            },
            spiritualPath: {
              type: 'string',
              description: 'User\'s spiritual path',
            },
            practiceGoals: {
              type: 'array',
              items: {
                type: 'string',
              },
              description: 'User\'s practice goals',
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./routes/*.js', './controllers/*.js'], // Paths to files containing OpenAPI definitions
};

const specs = swaggerJsdoc(options);

module.exports = {
  swaggerUi,
  specs,
};