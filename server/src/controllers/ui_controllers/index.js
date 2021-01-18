const express = require('express');

const authController = require('./auth-controller');
const dashboardController = require('./dashboard-controller');
const operationsController = require('./operations-controller');
const configController = require('./config-controller');
const piController = require('./pi-controller');

const authMiddleware = require('../../middlewares/auth-middleware');

const app = express();

module.exports = function() {
  app.use('/auth', authController());

  app.use(authMiddleware);
  app.get('/dashboard', dashboardController);

  app.use('/operations', operationsController());

  app.use('/config', configController());

  app.use('/pi', piController());

  return app;
};
