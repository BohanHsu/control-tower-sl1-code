const shouldPlayService = require('../../services/should-play-service');
const globalSwitchService = require('../../services/global-switch-service');

module.exports = function (req, res) {
  let gShouldPlayObj;
  shouldPlayService.queryShouldPlay().then((shouldPlayObj) => {
    gShouldPlayObj = shouldPlayObj;
    return globalSwitchService.queryGlobalSwitch()

    
  }).then((globalSwitchObj) => {
    res.json({data: {
      shouldPlay: gShouldPlayObj,
      globalSwitch: globalSwitchObj,
    }});
  });
};
