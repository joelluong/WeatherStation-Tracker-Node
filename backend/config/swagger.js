const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Weather Stations API',
      version: '1.0.0',
      description: 'A simple Express API for managing weather stations',
      contact: {
        name: 'API Support',
        email: 'support@example.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server'
      }
    ],
    components: {
      schemas: {
        WeatherStation: {
          type: 'object',
          required: ['id', 'name', 'site', 'portfolio', 'state', 'latitude', 'longitude'],
          properties: {
            id: {
              type: 'integer',
              description: 'The weather station ID'
            },
            name: {
              type: 'string',
              description: 'The weather station name'
            },
            site: {
              type: 'string',
              description: 'Name of site where weather station is located'
            },
            portfolio: {
              type: 'string',
              description: 'Owner of the site'
            },
            state: {
              type: 'string',
              description: 'State code (e.g., VIC, NSW, QLD, SA)'
            },
            latitude: {
              type: 'number',
              format: 'float',
              description: 'Latitude coordinate'
            },
            longitude: {
              type: 'number',
              format: 'float',
              description: 'Longitude coordinate'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            error: {
              type: 'string'
            },
            message: {
              type: 'string'
            }
          }
        },
        Success: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            data: {
              type: 'object'
            },
            count: {
              type: 'integer'
            }
          }
        }
      }
    }
  },
  apis: ['./routes/*.js'], // Path to the API routes
};

const specs = swaggerJsdoc(options);

module.exports = specs;