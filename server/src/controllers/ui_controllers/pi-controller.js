const express = require('express');

const temperatureService = require('../../services/temperature-service');

const responder = require('./responder');

const app = express();

module.exports = function() {
  app.get('/temperatures', function (req, res) {
    return temperatureService.getTemperature().then((temperatures) => {
      responder.json(req, res, {
        temperatures
      }, null);
    });
  });

  return app;
};
