const express = require('express');
const uiControllers = require('./ui_controllers');
const workerControllers = require('./worker_controllers');

const app = express();

module.exports = function() {
  app.use('/ui', uiControllers());
  app.use('/worker', workerControllers());

  return app;
};
