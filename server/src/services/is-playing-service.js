const IsPlaying = require('../models/is-playing-model');

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
    return IsPlaying.findOne({}).then((isPlayingObj, err) => {
      if (isPlayingObj) {
        isPlayingObj.isPlayingObj = isPlaying;
        return isPlayingObj.save();
      } else {
        return IsPlaying.create({isPlaying});
      }
    }).then((isPlayingObj) => {
      return isPlayingObj.isPlaying === isPlaying;
    });
  },
};
