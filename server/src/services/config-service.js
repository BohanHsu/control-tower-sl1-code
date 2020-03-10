const Config = require('../models/config-model');

function findOrCreateConfig() {
  return Config.findOne({}).then((configObj) => {
    if (configObj) {
      return configObj;
    }

    return Config.create({
      sendToWorker: false,
      humanOverrideConfig: "",
      humanOverrideConfigLastUpdateTime: new Date(0),
      workerReportedConfig: "",
      workerReportedAvailableMp3Files: [],
      workerReportConfigTime: new Date(0),
    })
  });
}

module.exports = {
  humanOverrideConfig: function(overrideConfigJSONString) {
    return findOrCreateConfig().then((configObj) => {
      if (configObj.humanOverrideConfig !== overrideConfigJSONString) {
        configObj.humanOverrideConfig = overrideConfigJSONString;
        configObj.sendToWorker = true;
        configObj.humanOverrideConfigLastUpdateTime = new Date();
      }

      return configObj.save();
    });
  },

  workerReport: function(configJSONString, availableMP3Files) {
    return findOrCreateConfig().then((configObj) => {
      configObj.workerReportedConfig = configJSONString;
      configObj.workerReportedAvailableMp3Files = availableMP3Files;
      configObj.workerReportConfigTime = new Date();

      return configObj.save();
    });
  },

  getConfig: function() {
    return findOrCreateConfig();
  },

  resetSendToWorkerFlagAndReturnOverrideConfig: function() {
    return findOrCreateConfig().then((configObj) => {
      configObj.sendToWorker = false;
      return configObj.save();
    }).then((configObj) => {
      return configObj.humanOverrideConfig;
    });
  },
};
