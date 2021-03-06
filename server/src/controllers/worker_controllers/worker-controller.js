const express = require('express');
const workerService = require('../../services/worker-service');
const isPlayingService = require('../../services/is-playing-service');
const globalSwitchService = require('../../services/global-switch-service');
const shouldPlayService = require('../../services/should-play-service');
const shouldPlayWindowService = require('../../services/should-play-window-service');
const duangRequestService = require('../../services/duang-request-service');
const ipService = require('../../services/ip-service');
const configService = require('../../services/config-service');
const configHistoryService = require('../../services/config-history-service');
const temperatureService = require('../../services/temperature-service');
const oneTimeCommandService = require('../../services/one-time-command-service');

const app = express();

module.exports = function() {
  app.post('/ping', function (req, res) {
    let gGlobalSwitchResp = false;
    let gShouldPlayResp = false;
    let gUseShouldPlayWindow = false;
    let gDuang = null;
    let gCommands = null;

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
    }).then(() => {
      if (req && req.body && req.body.temperature) {
        return temperatureService.recordTemperature(req.body.temperature);
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
          gUseShouldPlayWindow = shouldPlayObj.shouldPlayWindow;
          return shouldPlayObj.shouldPlay;
        });
      });
    }).then((shouldPlay) => {
      gShouldPlayResp = shouldPlay;

      if (!gShouldPlayResp && gUseShouldPlayWindow) {
        return shouldPlayWindowService.isNYTInAtLeastOneWindow();
      } else {
        return gShouldPlayResp;
      }
    }).then((shouldPlay) => {
      if (!gShouldPlayResp) {
        gShouldPlayResp = shouldPlay;
      }

      return duangRequestService.checkNextDuangRequest()
    }).then((duang) => {
      gDuang = duang;

      return oneTimeCommandService.findAndFlipToSendCommands();
    }).then((commands) => {
      if (commands !== null && commands.length > 0) {
        gCommands = commands;
      }

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
        shouldPlay: gShouldPlayResp,
      };

      if (gDuang) {
        response.duang = gDuang.duangRequestId;
      }

      if (gDuang && gDuang.optionalAudioFilePath) {
        response.duangAudioFilePath = gDuang.optionalAudioFilePath;
      }

      if (overrideConfig) {
        response.config = overrideConfig;
      }

      if (gCommands) {
        response.commands = gCommands;
      }

      res.json(response);
    });
  });

  app.post('/reportConfig', function(req, res) {
    const reportedConfigJSON = req.body.config;
    const availableMp3Files = req.body.availableMp3s;

    configService.workerReport(reportedConfigJSON, availableMp3Files).then(() => {
      return configHistoryService.addHistory(reportedConfigJSON);
    }).then(() => {
      res.json({});
    });
  });

  return app;
};
