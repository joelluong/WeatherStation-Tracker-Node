const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Weather Stations API',
    description: 'Express API for managing weather stations with PostgreSQL',
    version: '1.0.0'
  },
  host: 'localhost:3000',
  schemes: ['http'],
  basePath: '/',
  produces: ['application/json'],
  tags: [
    {
      name: 'Health',
      description: 'Health check endpoints'
    },
    {
      name: 'Weather Stations',
      description: 'Weather station management endpoints'
    },
    {
      name: 'Measurements',
      description: 'Weather measurement data endpoints'
    }
  ],
  definitions: {
    WeatherStation: {
      id: 1,
      name: 'Cohuna North',
      site: 'Cohuna Solar Farm',
      portfolio: 'Enel Green Power',
      state: 'VIC',
      latitude: -35.882762,
      longitude: 144.217208
    },
    MeasurementVariable: {
      varId: 11,
      weatherStationId: 1,
      name: 'AirT_inst',
      unit: 'Deg C',
      longName: 'Air Temperature'
    },
    Measurement: {
      id: 1,
      weatherStationId: 1,
      timestamp: '2023-08-29T06:00:00.000Z',
      values: {
        '11': {
          value: 17.09,
          var_name: 'AirT_inst',
          unit: 'Deg C',
          long_name: 'Air Temperature'
        }
      }
    },
    ImportRequest: {
      filePath: '/path/to/csv/file.csv'
    },
    SuccessResponse: {
      success: true,
      data: {},
      count: 0
    },
    ErrorResponse: {
      success: false,
      error: 'Error message',
      message: 'Detailed error message'
    },
    ImportResponse: {
      success: true,
      message: 'Successfully imported X records',
      imported: 10,
      errors: []
    }
  }
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./index.js'];

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  console.log('Swagger documentation generated successfully!');
});