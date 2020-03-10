const express = require('express');
const workerService = require('../../services/worker-service');
const isPlayingService = require('../../services/is-playing-service');
const globalSwitchService = require('../../services/global-switch-service');
const shouldPlayService = require('../../services/should-play-service');
const duangRequestService = require('../../services/duang-request-service');
const ipService = require('../../services/ip-service');
const configService = require('../../services/config-service');

const app = express();

module.exports = function() {
  app.post('/ping', function (req, res) {
    let gGlobalSwitchResp = false;
    let gShouldPlayResp = false;
    let gDuang = null;

    const isPlaying = !!(req.body.isPlaying);
    const requireConfig = !!(req.body.requireConfig);
    // Handle work reports
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
      if (req && req.body && req.body.ip) {
        return ipService.updateIp(req.body.ip);
      }
      return null;
      // End handle work reports
    }).then(() => {
      return globalSwitchService.queryGlobalSwitch().then((globalSwitchObj) => {
        gGlobalSwitchResp = globalSwitchObj && globalSwitchObj.isOn;
        return globalSwitchObj && globalSwitchObj.isOn;
      }).then((shouldPlay) => {
        if (!shouldPlay) {
          return shouldPlay;
        }

        return shouldPlayService.queryShouldPlay().then((shouldPlayObj) => {
          return shouldPlayObj.shouldPlay;
        });
      });
    }).then((shouldPlay) => {
      gShouldPlayResp = shouldPlay;

      return duangRequestService.checkNextDuangRequest()
    }).then((duang) => {
      gDuang = duang;

      return configService.getConfig().then((configObj) => {
        if (configObj.sendToWorker || requireConfig) {
          return configService.resetSendToWorkerFlagAndReturnOverrideConfig();
        } else {
          return null;
        }
      });
    }).then((overrideConfig) => {
      let response = {
        globalSwitch: gGlobalSwitchResp,
        shouldPlay: gShouldPlayResp
      };

      if (gDuang) {
        response.duang = gDuang;
      }

      if (overrideConfig) {
        response.config = overrideConfig;
      }

      res.json(response);
    });
  });

  app.post('/reportConfig', function(req, res) {
    const reportedConfigJSON = req.body.config;
    const availableMp3FilesString = req.body.availableMp3s;

    const availableMp3Files = availableMp3FilesString.split(" ");

    configService.findOrCreateConfig.workerReport(reportedConfigJSON, availableMp3Files).then(() => {
      res.json({});
    });
  });

  return app;
};
