const shouldPlayService = require('../../services/should-play-service');
const globalSwitchService = require('../../services/global-switch-service');
const isPlayingSerivce = require('../../services/is-playing-service');

const responder = require('./responder');

module.exports = function (req, res) {
  let gShouldPlayObj;
  let gGlobalSwitchObj;
  shouldPlayService.queryShouldPlay().then((shouldPlayObj) => {
    gShouldPlayObj = shouldPlayObj;
    return globalSwitchService.queryGlobalSwitch()

    
  }).then((globalSwitchObj) => {
    gGlobalSwitchObj = globalSwitchObj;
    return isPlayingSerivce.queryIsPlaying()
  }).then((isPlayingObj) => {
    responder.json(req, res, {
      shouldPlay: {shouldPlay: gShouldPlayObj.shouldPlay},
      globalSwitch: {isOn: gGlobalSwitchObj.isOn},
      isPlaying: {isPlaying: isPlayingObj.isPlaying},
    }, null);
  });
};
