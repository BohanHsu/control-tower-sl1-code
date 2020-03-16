const express = require('express');

const configService = require('../../services/config-service');

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
    return configService.getConfig().then((configObj) => {
      return responder.json(req, res, {
        humanOverrideConfig: configObj.humanOverrideConfig,
        humanOverrideConfigLastUpdateTime: configObj.humanOverrideConfigLastUpdateTime,
        workerReportedConfig: configObj.workerReportedConfig,
        workerReportedAvailableMp3Files: configObj.workerReportedAvailableMp3Files,
        workerReportConfigTime: configObj.workerReportConfigTime,
      });
    });
  });

  return app;
}
