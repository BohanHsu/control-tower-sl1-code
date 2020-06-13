const ShouldPlay = require('../models/should-play-model');

module.exports = {
  queryShouldPlay: function() {
    return ShouldPlay.findOne({}).then((shouldPlayObj, err) => {
      if (shouldPlayObj) {
        return shouldPlayObj;
      }

      return ShouldPlay.create({
        shouldPlay: false,
      }).then((obj) => {
        return ShouldPlay.findOne({}).exec();
      }).then((shouldPlayObj) => {
        return shouldPlayObj;
      });
    });
  },

  updateShouldPlay: function(shouldPlayVal) {
    return ShouldPlay.findOne({}).then((shouldPlayObj, err) => {
      if (err) {
        return null;
      }

      return shouldPlayObj;
    }).then((shouldPlayObj) => {
      shouldPlayObj.shouldPlay = shouldPlayVal;
      return shouldPlayObj.save();
    }).then((shouldPlayObj) => {
      return shouldPlayObj.shouldPlay === shouldPlayVal;
    });
  },

  updateShouldPlayWindow: function(shouldPlayWindowVal) {
    return ShouldPlay.findOne({}).then((shouldPlayObj, err) => {
      if (err) {
        return null;
      }

      return shouldPlayObj;
    }).then((shouldPlayObj) => {
      shouldPlayObj.shouldPlayWindow = shouldPlayWindowVal;
      return shouldPlayObj.save();
    }).then((shouldPlayObj) => {
      return shouldPlayObj.shouldPlayWindow === shouldPlayWindowVal;
    });
  },
};

