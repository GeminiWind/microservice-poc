import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Storage Service',
      version: '1.0.0',
    },
  },
  apis: ['**/func/**/*.js'],
};

const spec = swaggerJSDoc(options);

export default spec;
