const ShouldPlay = require('../models/should-play-model');

module.exports = {
  queryShouldPlay: function() {
    return ShouldPlay.findOne({}).then((shouldPlayObj, err) => {
      console.log("xbh1", err, JSON.stringify(shouldPlayObj));
      if (shouldPlayObj) {
        return shouldPlayObj;
      }

      return ShouldPlay.create({
        shouldPlay: false,
      }).then((obj) => {
        console.log("xbh1", JSON.stringify(obj));
        return ShouldPlay.findOne({}).exec();
      }).then((shouldPlayObj) => {
        return shouldPlayObj;
      });
    });
  }
};

