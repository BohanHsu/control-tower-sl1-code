const express = require('express');
const globalSwitchService = require('../../services/global-switch-service');
const shouldPlayService = require('../../services/should-play-service');

const responder = require('./responder');

const app = express();

module.exports = function() {
  app.post('/globalSwitch', function(req, res) {
    let isOn = false;
    if (req && req.body) {
      isOn = req.body.isOn;
    }
    globalSwitchService.updateGlobalSwitch(isOn).then((result) => {
      responder.json(req, res, {
        updated: result,
      }, null);
    });
  });

  app.post('/shouldPlay', function(req, res) {
    let shouldPlayVal = false;
    if (req && req.body) {
      shouldPlayVal = req.body.shouldPlay;
    }

    shouldPlayService.updateShouldPlay(shouldPlayVal).then((result) => {
      responder.json(req, res, {
        updated: result,
      }, null);
    });
  });

  return app;
};
