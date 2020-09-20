const express = require('express');
const globalSwitchService = require('../../services/global-switch-service');
const shouldPlayService = require('../../services/should-play-service');
const shouldPlayWindowService = require('../../services/should-play-window-service');
const duangRequestService =require('../../services/duang-request-service');
const timeConverter = require('../../utils/time-converter');

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

  app.post('/shouldPlayWindow/flip', function(req, res) {
    const shouldUseShouldPlayWindow = req.body.shouldUseShouldPlayWindow;

    shouldPlayService.updateShouldPlayWindow(shouldUseShouldPlayWindow).then((result) => {
      responder.json(req, res, {
        updated: result,
      }, null);
    });
  });

  app.post('/shouldPlayWindow/add', function(req, res) {
    const startHourInt = parseInt(req.body.startHour);
    const startMinuteInt = parseInt(req.body.startMinute);
    const startSecondInt = parseInt(req.body.startSecond);
    const endHourInt = parseInt(req.body.endHour);
    const endMinuteInt = parseInt(req.body.endMinute);
    const endSecondInt = parseInt(req.body.endSecond);

    shouldPlayWindowService.createShouldPlayWindow(
      startHourInt,
      startMinuteInt,
      startSecondInt,
      endHourInt,
      endMinuteInt,
      endSecondInt,
    ).then((shouldPlayWindowId) => {
      responder.json(req, res, {
        created: shouldPlayWindowId != null,
      }, null);
    });
  });

  app.post('/shouldPlayWindow/remove', function(req, res) {
    return shouldPlayWindowService.deleteShouldPlayWindow(req.body.shouldPlayWindowId).then((updated) => {
      responder.json(req, res, {
        updated,
      }, null);
    });
  });

  app.get('/shouldPlayWindow', function (req, res) {
    return shouldPlayWindowService.findAllShouldPlayWindow().then((shouldPlayWindows) => {
      responder.json(req, res, {
        shouldPlayWindows
      }, null);
    });
  });

  app.post('/requestDuang', function(req, res) {
    let utcDate = null;
    let optionalAudioFilePath = null;

    if (req.body.schedule) {
      const year = req.body.duangYear;
      const month = req.body.duangMonth;
      const date = req.body.duangDate;
      const hour = req.body.duangHour;
      const minute = req.body.duangMinute;
      const second = req.body.duangSecond;

      utcDate = timeConverter.fromNYCYMDHMSToUTCDate(year, month, date, hour, minute, second);
    }

    if (req.body.optionalAudioFilePath) {
      optionalAudioFilePath = req.body.optionalAudioFilePath;
    }

    duangRequestService.requestDuang(utcDate, optionalAudioFilePath).then((duangRequestObj) => {
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
