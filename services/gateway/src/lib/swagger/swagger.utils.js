const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'The Gateway API',
    description: 'The Gateway API for the Microservices',
  },
  host: `localhost:${process.env.GATEWAY_PORT || 50000}`,
  definitions: {
    Status: {
      '@enum': [
        "PENDING",
        "IN_PROGRESS",
        "FULFILLED",
        "REJECTED"
      ]
    },
    DeliveryType: {
      '@enum': [
        "TAKEAWAY",
        "DELIVERY"
      ]
    },
    Method: {
      '@enum': [
        "PERCENT",
        "VALUE"
      ]
    },
    RoleCode: {
      '@enum': [
        "ADMIN",
        "USER",
        "ACCOUNTANT",
        "DELIVERER"
      ]
    }
  }
};

const outputFile = './swagger-output.json';
const routes = ['../../server.ts',];

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

swaggerAutogen(outputFile, routes, doc);