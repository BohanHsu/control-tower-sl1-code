const express = require('express');

const temperatureService = require('../../services/temperature-service');
const oneTimeCommandService = require('../../services/one-time-command-service');

const responder = require('./responder');

const app = express();

module.exports = function() {
  app.post('/runcommand', function(req, res) {
    let commandKey = null;
    if (req && req.body) {
      commandKey = req.body.commandKey;
    }

    if (commandKey) {
      oneTimeCommandService.sendCommand(commandKey).then(() => {
        responder.json(req, res, {
          sent: true,
        }, null);
      });
    } else {
      responder.json(req, res, {
        sent: true,
      }, null);
    }
  });

  app.get('/temperatures', function (req, res) {
    return temperatureService.getTemperature().then((temperatures) => {
      responder.json(req, res, {
        temperatures
      }, null);
    });
  });


  return app;
};
