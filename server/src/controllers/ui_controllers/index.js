const express = require('express');

const dashboardController = require('./dashboard-controller');
const operationsController = require('./operations-controller');

const app = express();

module.exports = function() {
  app.get('/dashboard', dashboardController);

  app.use('/operations', operationsController());

  return app;
};
