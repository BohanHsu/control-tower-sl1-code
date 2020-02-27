const express = require('express');
const workerService = require('../../services/worker-service');
const isPlayingService = require('../../services/is-playing-service');
const globalSwitchService = require('../../services/global-switch-service');
const shouldPlayService = require('../../services/should-play-service');

const app = express();

module.exports = function() {
  app.post('/ping', function (req, res) {
    const isPlaying = !!(req.body.isPlaying);
    return isPlayingService.updateIsPlaying(isPlaying).then(() => {
      return globalSwitchService.queryGlobalSwitch().then((globalSwitchObj) => {
        return globalSwitchObj && globalSwitchObj.isOn;
      }).then((shouldPlay) => {
        if (!shouldPlay) {
          return shouldPlay;
        }

        return shouldPlayService.queryShouldPlay().then((shouldPlayObj) => {
          return shouldPlayObj.shouldPlay;
        });
      })
    }).then((shouldPlay) => {
      res.json({shouldPlay});
    });
  });

  return app;
};
