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
  }
};

