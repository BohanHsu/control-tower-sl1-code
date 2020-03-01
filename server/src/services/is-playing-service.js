const IsPlaying = require('../models/is-playing-model');
const isPlayingHistoryService = require('./is-playing-history-service');

module.exports = {
  queryIsPlaying: function() {
    return IsPlaying.findOne({}).then((isPlayingObj, err) => {
      if (isPlayingObj) {
        return isPlayingObj;
      }

      return IsPlaying.create({
        isPlaying: false,
        lastWorkerReportTime: new Date(0),
      });
    });
  },

  updateIsPlaying: function(isPlaying) {
    let gIsPlayingObj;
    return IsPlaying.findOne({}).then((isPlayingObj, err) => {
      if (isPlayingObj) {
        return isPlayingObj;
      } else {
        return IsPlaying.create({
          isPlaying,
          lastWorkerReportTime: new Date(),
        });
      }
    }).then((isPlayingObj) => {
      gIsPlayingObj = isPlayingObj;
      if (isPlayingObj.isPlaying !== isPlaying) {
        // update history
        return isPlayingHistoryService.handleIsPlayingChange(isPlaying);
      }
      return;
    }).then(() => {
      gIsPlayingObj.isPlaying = isPlaying;
      gIsPlayingObj.lastWorkerReportTime = new Date();
      return gIsPlayingObj.save();
    }).then((isPlayingObj) => {
      return isPlayingObj.isPlaying === isPlaying;
    });
  },
};
