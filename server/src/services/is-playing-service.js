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
      });
    });
  },

  updateIsPlaying: function(isPlaying) {
    let gIsPlayingObj;
    return IsPlaying.findOne({}).then((isPlayingObj, err) => {
      if (isPlayingObj) {
        return isPlayingObj;
      } else {
        return IsPlaying.create({isPlaying});
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
      return gIsPlayingObj.save();
    }).then((isPlayingObj) => {
      return isPlayingObj.isPlaying === isPlaying;
    });
  },
};
