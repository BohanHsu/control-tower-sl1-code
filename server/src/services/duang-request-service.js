const mongoose = require('mongoose');

const DuangRequest = require('../models/duang-request-model');
const globalSwitchService = require('./global-switch-service');

module.exports = {
  requestDuang: function(scheduleTimeUTCDate = null, optionalAudioFilePath = null) {
    const numberOfRecordToKeep = 100;

    let gDuangRequestObj = null
    let newDuang = {
      requestedAt: new Date(),
      currentState: 'notHandleYet',
    };

    if (scheduleTimeUTCDate) {
      newDuang.scheduleDuangTime = scheduleTimeUTCDate;
    }

    if (optionalAudioFilePath) {
      newDuang.optionalAudioFilePath = optionalAudioFilePath;
    }

    return DuangRequest.create(newDuang).then((duangRequestObj) => {
      gDuangRequestObj = duangRequestObj;

      return DuangRequest.find({}).sort({requestedAt: 1}).exec();
    }).then((duangRequestObjs) => {
      if (duangRequestObjs.length > numberOfRecordToKeep) {
        // Clean closed duang requests
        const numToRemove = duangRequestObjs.length - numberOfRecordToKeep;
        let toRemoveQueue = [];

        duangRequestObjs.forEach((obj) => {
          if (obj.requestClosedAt) {
            if (toRemoveQueue.length < numToRemove) {
              toRemoveQueue.push(obj);
            }
          }
        })

        cleanQueueFunc = function() {
          if (toRemoveQueue.length === 0) {
            return true;
          }

          const firstObj = toRemoveQueue.pop();
          return DuangRequest.findByIdAndDelete(firstObj._id).then((a) => {
            return cleanQueueFunc();
          })
        };

        return cleanQueueFunc().then(() => {
          return gDuangRequestObj;
        });
      }

      return gDuangRequestObj;
    });
  },

  cancelDuang: function(requestId) {
    return DuangRequest.findById(requestId).then((duangRequestObj) => {
      if (duangRequestObj) {
        if (duangRequestObj.currentState === 'notHandleYet') {
          duangRequestObj.requestClosedAt = new Date();
          duangRequestObj.currentState = 'manualRejected';
          duangRequestObj.rejectReason = 'Human rejected from UI';

          return duangRequestObj.save().then((duangRequestObj) => {
            return !!duangRequestObj.requestClosedAt;
          });
        }

        return false;
      }

      return false;
    });
  },

  checkNextDuangRequest: function() {
    return DuangRequest.findOne({
      currentState: 'notHandleYet',
      scheduleDuangTime: {'$exists': false}
    }).sort({requestedAt: 1}).exec().then((duangRequestObj, err) => {
      if (!duangRequestObj) {
        return null;
      }

      return duangRequestObj;
    }).then((duangRequestObj) => {
      if (duangRequestObj) {
        return duangRequestObj;
      }

      const nowDate = new Date();

      return DuangRequest.findOne({
        currentState: 'notHandleYet',
        scheduleDuangTime: {'$exists': true},
        scheduleDuangTime: {'$lt': nowDate},
      }).sort({requestedAt: 1}).exec();

    }).then((duangRequestObj, err) => {
      if (!duangRequestObj) {
        return null;
      }

      return duangRequestObj;
    }).then((duangRequestObj) => {
      return globalSwitchService.queryGlobalSwitch().then((globalSwitchObj) => {
        return globalSwitchObj.isOn;
      }).then((isOn) => {
        if (!isOn && duangRequestObj) {
          duangRequestObj.requestClosedAt = new Date();
          duangRequestObj.currentState = 'serverRejected';
          duangRequestObj.rejectReason = 'Global switch is off at worker asking control tower time';
          return duangRequestObj.save().then(() => {
            return null;
          })
        }

        return duangRequestObj;
      });
    }).then((duangRequestObj) => {
      if (!duangRequestObj) {
        return null;
      }

      duangRequestObj.sentToWorkerAt = new Date();
      duangRequestObj.currentState = 'sentToWorker';
      return duangRequestObj.save();
    }).then((duangRequestObj) => {
      if (duangRequestObj) {
        return {
          duangRequestId: duangRequestObj._id,
          optionalAudioFilePath: duangRequestObj.optionalAudioFilePath,
        };
      }

      return null;
    });
  },

  updateDuangRequestState: function(requestIdStr, workerPlayedRequest, rejectReason) {
    new Promise((resolve, reject) => {
      let requestIdObj = null;
      try {
        requestIdObj = mongoose.Types.ObjectId(requestIdStr);
      } catch (err) {
      }
      resolve(requestIdObj);
    }).then((requestId) => {
      return DuangRequest.findById(requestId).then((duangRequestObj) => {
        if (duangRequestObj && !duangRequestObj.requestClosedAt) {
          if (workerPlayedRequest) {
            duangRequestObj.currentState = 'duangPlayed';
          } else {
            duangRequestObj.currentState = 'workerRejected';
            duangRequestObj.rejectReason = rejectReason;
          }

          duangRequestObj.requestClosedAt = new Date();
          return duangRequestObj.save();
        }

        return null;
      });
    });
  },

  duangRequestHistory: function() {
    return DuangRequest.find().sort({requestedAt: -1}).exec().then((duangRequestObjs) => {
      if (duangRequestObjs) {
        const historyToReturn = duangRequestObjs.map((obj) => {
          let result = {
            requestId: obj._id,
            requestedAt: new Date(obj.requestedAt).getTime(),
            currentState: obj.currentState,
          };

          if (obj.sentToWorkerAt) {
            result.sentToWorkerAt = new Date(obj.sentToWorkerAt).getTime();
          }

          if (obj.requestClosedAt) {
            result.requestClosedAt = new Date(obj.requestClosedAt).getTime();
          }

          if (obj.rejectReason) {
            result.rejectReason = obj.rejectReason;
          }

          if (obj.scheduleDuangTime) {
            result.scheduleDuangTime = new Date(obj.scheduleDuangTime).getTime();
          }

          if (obj.optionalAudioFilePath) {
            result.optionalAudioFilePath = obj.optionalAudioFilePath;
          }

          return result;
        });

        return historyToReturn;
      }

      return [];
    });
  },
};
