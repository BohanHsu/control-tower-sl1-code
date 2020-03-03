const shouldPlayService = require('../../services/should-play-service');
const globalSwitchService = require('../../services/global-switch-service');
const isPlayingSerivce = require('../../services/is-playing-service');
const isPlayingHistorySerivce = require('../../services/is-playing-history-service');
const ipSerivce = require('../../services/ip-service');

const responder = require('./responder');

module.exports = function (req, res) {
  let gShouldPlayObj;
  let gGlobalSwitchObj;
  let gIsPlayingObj
  let gIpObj = {};
  shouldPlayService.queryShouldPlay().then((shouldPlayObj) => {
    gShouldPlayObj = shouldPlayObj;
    return globalSwitchService.queryGlobalSwitch()
  }).then((globalSwitchObj) => {
    gGlobalSwitchObj = globalSwitchObj;
    return isPlayingSerivce.queryIsPlaying()
  }).then((isPlayingObj) => {
    gIsPlayingObj = isPlayingObj;
    return ipSerivce.queryIp();
  }).then((ipObj) => {
    if (ipObj) {
      gIpObj = ipObj;
    }
    return isPlayingHistorySerivce.queryIsPlayingHistory();
  }).then((isPlayingHistories) => {
    responder.json(req, res, {
      shouldPlay: {shouldPlay: gShouldPlayObj.shouldPlay},
      globalSwitch: {isOn: gGlobalSwitchObj.isOn},
      isPlaying: {
        isPlaying: gIsPlayingObj.isPlaying,
        lastUpdate: new Date(gIsPlayingObj.updated_at).getTime(),
        lastWorkerReportTime: new Date(gIsPlayingObj.lastWorkerReportTime).getTime(),
      },
      isPlayingHistories,
      ip: {
        ipAddress: gIpObj.ipAddress,
        lastReportAt: gIpObj.lastReportAt,
      },
    }, null);
  });
};
