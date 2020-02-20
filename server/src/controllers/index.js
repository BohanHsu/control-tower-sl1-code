const express = require('express');
const bodyParser = require('body-parser');
const uiControllers = require('./ui_controllers');
const workerControllers = require('./worker_controllers');

const app = express();

module.exports = function() {
  app.use(bodyParser.json({
    'content-type': 'application/json*',
  }));

  app.use('/ui', uiControllers());
  app.use('/worker', workerControllers());

  return app;
};
