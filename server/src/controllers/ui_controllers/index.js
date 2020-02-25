const express = require('express');

const authController = require('./auth-controller');
const dashboardController = require('./dashboard-controller');
const operationsController = require('./operations-controller');

const authMiddleware = require('../../middlewares/auth-middleware');

const app = express();

module.exports = function() {
  app.use('/auth', authController());

  app.use(authMiddleware);
  app.get('/dashboard', dashboardController);

  app.use('/operations', operationsController());

  return app;
};
