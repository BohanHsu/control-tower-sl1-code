const GlobalSwitch = require('../models/global-switch-model');

module.exports = {
  queryGlobalSwitch: function() {
    return GlobalSwitch.findOne({}).then((globalSwitchObj, err) => {
      if (globalSwitchObj) {
        return globalSwitchObj;
      }

      return GlobalSwitch.create({
        isOn: false,
      }).then((obj) => {
        return GlobalSwitch.findOne({}).exec();
      }).then((globalSwitchObj) => {
        return globalSwitchObj;
      });
    });
  },

  updateGlobalSwitch: function(isOn) {
    return GlobalSwitch.findOne({}).then((globalSwitchObj, err) => {
      if (err) {
        return null;
      }

      return globalSwitchObj;
    }).then((globalSwitchObj) => {
      globalSwitchObj.isOn = isOn;
      return globalSwitchObj.save();
    }).then((globalSwitchObj) => {
      return globalSwitchObj.isOn === isOn;
    });
  },
};

