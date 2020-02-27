const express = require('express');
const workerController = require('./worker-controller');
const workerAuthMiddleware = require('../../middlewares/worker-auth-middleware');

const app = express();

module.exports = function() {
  app.use(workerAuthMiddleware);

  app.use('/', workerController());

  return app;
};
