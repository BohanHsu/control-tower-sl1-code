const express = require('express');
const globalSwitchService = require('../../services/global-switch-service');
const shouldPlayService = require('../../services/should-play-service');
const duangRequestService =require('../../services/duang-request-service');

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

  app.post('/requestDuang', function(req, res) {
    duangRequestService.requestDuang().then((duangRequestObj) => {
      responder.json(req, res, {
        created: !!duangRequestObj,
      }, null);
    });
  });

  app.post('/cancelDuang', function(req, res) {
    let requestId = null;
    if (req && req.body) {
      requestId = req.body.requestId;
    }

    duangRequestService.cancelDuang(requestId).then((cancelled) => {
      responder.json(req, res, {
        cancelled,
      }, null);
    });
  });


  // probably should be at somewhere else
  app.get('/duangRequestHistory', function (req, res) {
    duangRequestService.duangRequestHistory().then((history) => {
      responder.json(req, res, {
        history,
      }, null);
    });
  });

  return app;
};
