const express = require('express');
const workerService = require('../../services/worker-service');
const isPlayingService = require('../../services/is-playing-service');
const globalSwitchService = require('../../services/global-switch-service');
const shouldPlayService = require('../../services/should-play-service');
const duangRequestService = require('../../services/duang-request-service');

const app = express();

module.exports = function() {
  app.post('/ping', function (req, res) {
    let gShouldPlayResp = false;

    const isPlaying = !!(req.body.isPlaying);
    return isPlayingService.updateIsPlaying(isPlaying).then(() => {
      let duangRequestId = null;
      let duangPlayed = false;
      let duangRejectReason = null;

      if (req && req.body && req.body.duang) {
        duangRequestId = req.body.duang.requestId;
        duangPlayed = !!req.body.duang.duangPlayed;
        duangRejectReason = req.body.duang.rejectReason;
      }

      if (duangRequestId) {
        return duangRequestService.updateDuangRequestState(duangRequestId, duangPlayed, duangRejectReason);
      }
      return null;
    }).then(() => {
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
      gShouldPlayResp = shouldPlay;

      return duangRequestService.checkNextDuangRequest()
    }).then((duang) => {
      let response = {shouldPlay: gShouldPlayResp};
      if (duang) {
        response.duang = duang;
      }

      res.json(response);
    });
  });

  return app;
};
