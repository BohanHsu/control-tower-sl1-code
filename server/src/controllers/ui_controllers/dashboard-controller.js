const shouldPlayService = require('../../services/should-play-service');
const globalSwitchService = require('../../services/global-switch-service');

const responder = require('./responder');

module.exports = function (req, res) {
  let gShouldPlayObj;
  shouldPlayService.queryShouldPlay().then((shouldPlayObj) => {
    gShouldPlayObj = shouldPlayObj;
    return globalSwitchService.queryGlobalSwitch()

    
  }).then((globalSwitchObj) => {
    responder.json(req, res, {
      shouldPlay: gShouldPlayObj,
      globalSwitch: globalSwitchObj,
    }, null);
  });
};
