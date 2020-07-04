const ConfigHistory = require('../models/config-history-model');


module.exports = {
  addHistory: function(workerReported) {
    const numberOfRecordToKeep = 5;

    return ConfigHistory.findOne({}).sort({created_at: -1}).exec().then((configHistory) => {
      if (configHistory && configHistory.workerReportedConfig === workerReported) {
        return null;
      } else {
        return ConfigHistory.create({
          workerReportedConfig: workerReported
        });
      }
    }).then(() => {
      return ConfigHistory.find({$or: [{pinned: false}, {pinned: null}]}).sort({created_at: -1}).exec().then((configHistories) => {
        let toRemoveQueue = [];
        configHistories.forEach((configHistory, idx) => {
          if (idx >= numberOfRecordToKeep) {
            toRemoveQueue.push(configHistory);
          }
        });


        cleanQueue = function() {
          if (toRemoveQueue.length === 0) {
            return new Promise((resolve, reject) => {
              resolve();
            });
          }
          const firstObj = toRemoveQueue.pop();
          return ConfigHistory.findByIdAndDelete(firstObj._id).then(() => {
            return cleanQueue();
          });
        };

        return cleanQueue().then(() => {
          return true;
        });
      });
    });
  },

  getAllHistory: function() {
    return ConfigHistory.find({}).sort({created_at: -1}).exec().then((configHistories) => {
      return configHistories.map((configHistory) => {
        return {
          id: configHistory._id,
          created_at: configHistory.created_at,
          workerReportedConfig: configHistory.workerReportedConfig,
          pinned: configHistory.pinned,
          description: configHistory.description,
        };
      });
    });
  },

  updateConfigHistory: function(id, fieldsToUpdate) {
    return ConfigHistory.findOne({_id: id}).exec().then((configHistory) => {
      if (fieldsToUpdate.pinned === true || fieldsToUpdate.pinned === false) {
        configHistory.pinned = fieldsToUpdate.pinned;
      }

      if (fieldsToUpdate.description) {
        configHistory.description = fieldsToUpdate.description;
      }

      return configHistory.save();
    });
  },
};
