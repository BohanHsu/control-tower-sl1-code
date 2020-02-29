const IsPlaying = require('../models/is-playing-model');

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
    return IsPlaying.findOne({}).then((isPlayingObj, err) => {
      if (isPlayingObj) {
        isPlayingObj.isPlaying = isPlaying;
        isPlayingObj.lastWorkerReportTime = new Date();
        return isPlayingObj.save();
      } else {
        return IsPlaying.create({
          isPlaying,
          lastWorkerReportTime: new Date(),
        });
      }
    }).then((isPlayingObj) => {
      return isPlayingObj.isPlaying === isPlaying;
    });
  },
};
