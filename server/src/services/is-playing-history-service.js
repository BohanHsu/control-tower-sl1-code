const IsPlayingHistory = require('../models/is-playing-history-model');

module.exports = {
  queryIsPlayingHistory: function() {
    return IsPlayingHistory.find({}).sort({startPlayTime: -1}).exec().then((isPlayingHistories) => {
      return isPlayingHistories;
    }).then((lastIsPlayingHistoryObj) => {
      return lastIsPlayingHistoryObj.map((obj) => {
        return {
          startTime: new Date(obj.startPlayTime).getTime(),
          endTime: obj.endPlayTime ? new Date(obj.endPlayTime).getTime() : null,
        }
      });
    });
  },



  handleIsPlayingChange: function(newIsPlaying) {
    const numberOfHistoryToKeep = 20;
    new Promise((resolve) => {
      resolve();
    }).then(() => {
      if (newIsPlaying) {
        return IsPlayingHistory.create({
          startPlayTime: new Date(),
        }).then(() => {
          return IsPlayingHistory.find({}).sort({startPlayTime: -1}).then((isPlayingHistories) => {
            if (isPlayingHistories.length > numberOfHistoryToKeep) {
              let removeQueue = [];
              for (let i = 0; i < isPlayingHistories.length; i++) {
                if (i >= numberOfHistoryToKeep) {
                  removeQueue.push(isPlayingHistories[i]);
                }
              }

              cleanQueue = function() {
                if (removeQueue.length === 0) {
                  return new Promise((resolve, reject) => {
                    resolve();
                  });
                }
                const firstObj = removeQueue.pop();
                return IsPlayingHistory.findByIdAndDelete(firstObj._id).then(() => {
                  return cleanQueue();
                });
              }

              return cleanQueue().then(() => {
                return true;
              });
            }

            return true;
          });
        });
      } else {
        return IsPlayingHistory.findOne({}).sort({startPlayTime: -1}).exec().then((lastIsPlayingHistoryObj) => {
          lastIsPlayingHistoryObj.endPlayTime = new Date();
          return lastIsPlayingHistoryObj.save();
        });
      }
    });
  },
};
