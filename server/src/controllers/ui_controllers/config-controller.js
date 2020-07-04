const express = require('express');

const configService = require('../../services/config-service');
const configHistoryService = require('../../services/config-history-service');

const responder = require('./responder');

const app = express();

module.exports = function() {
  app.post('/updateConfig', function(req, res) {
    let humanOverrideConfig = '';

    if (req && req.body) {
      humanOverrideConfig = req.body.humanOverrideConfig;
    }

    if (humanOverrideConfig && humanOverrideConfig.length > 0) {
      configService.humanOverrideConfig(humanOverrideConfig).then((configObj) => {
        const updated = (configObj.humanOverrideConfig === humanOverrideConfig);

        responder.json(req, res, {
          updated,
        });
      });
    } else {
      responder.json(req, res, {
        updated: false,
      });
    }
  });

  app.get('/config', function(req, res) {
    let gConfigHistories = null;
    return configHistoryService.getAllHistory().then((configHistories) => {
      gConfigHistories = configHistories;

      return configService.getConfig();
    }).then((configObj) => {
      return responder.json(req, res, {
        humanOverrideConfig: configObj.humanOverrideConfig,
        humanOverrideConfigLastUpdateTime: configObj.humanOverrideConfigLastUpdateTime,
        workerReportedConfig: configObj.workerReportedConfig,
        workerReportedAvailableMp3Files: configObj.workerReportedAvailableMp3Files,
        workerReportConfigTime: configObj.workerReportConfigTime,
        configHistories: gConfigHistories,
      });
    });
  });

  app.post('/updateConfigHistory', function(req, res) {
    if (req && req.body) {
      const id = req.body.configHistoryId;

      const toUpdate = {};
      if (req.body.pinned === true || req.body.pinned === false) {
        toUpdate.pinned = req.body.pinned;
      }

      if (req.body.description) {
        toUpdate.description = req.body.description;
      }

      return configHistoryService.updateConfigHistory(id, toUpdate).then(() => {
        responder.json(req, res, {});
      });
    }

    responder.json(req, res, {});
  });

  return app;
}
