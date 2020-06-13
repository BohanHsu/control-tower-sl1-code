const ShouldPlayWindow = require('../models/should-play-window-model');
const timeConverter = require('../utils/time-converter');

module.exports = {
  createShouldPlayWindow: function(
    startHour,
    startMinute,
    startSecond,
    endHour,
    endMinute,
    endSecond,
  ) {
    if (startHour < 0 || startHour > 23) {
      return null;
    }

    if (endHour < 0 || endHour > 23) {
      return null;
    }

    if (startMinute < 0 || startMinute > 59) {
      return null;
    }

    if (endMinute < 0 || endMinute > 59) {
      return null;
    }

    if (startSecond < 0 || startSecond > 59) {
      return null;
    }

    if (endSecond < 0 || endSecond > 59) {
      return null;
    }

    return ShouldPlayWindow.create({
      startHour,
      startMinute,
      startSecond,
      endHour,
      endMinute,
      endSecond,
    }).then((shouldPlayWindow,) => {
      if (!shouldPlayWindow) {
        return null;
      }
      return shouldPlayWindow._id;
    });
  },

  findAllShouldPlayWindow: function() {
    return ShouldPlayWindow.find({}).sort([
      ['startHour', 1],
      ['endHour', 1],
      ['startMinute', 1],
      ['endMinute', 1],
      ['startSecond', 1],
      ['endSecond', 1],
    ]).exec().then((shouldPlayWindowObjs) => {
      return shouldPlayWindowObjs.map((shouldPlayWindowObj) => {
        const {startHour, startMinute, startSecond, endHour, endMinute, endSecond} = shouldPlayWindowObj;
        return {
          startHour, 
          startMinute, 
          startSecond, 
          endHour, 
          endMinute, 
          endSecond,
          id: shouldPlayWindowObj._id,
        };
      });
    });
  },

  deleteShouldPlayWindow: function(shouldPlayWindowId) {
    return ShouldPlayWindow.deleteOne({_id: shouldPlayWindowId}).then((err) => {
      return !!err;
    });
  },

  isNYTInAtLeastOneWindow: function() {
    return ShouldPlayWindow.find({}).then((shouldPlayWindowObjs) => {
      if (shouldPlayWindowObjs.length === 0) {
        return false;
      }

      let isIn = false;
      const {year, month, date} = timeConverter.currentYMDAtNY();

      console.log('xbh1', year, month, date);


      shouldPlayWindowObjs.forEach((shouldPlayWindowObjs) => {
        if (!isIn) {
          const {
            startHour,
            startMinute,
            startSecond,
            endHour,
            endMinute,
            endSecond,
          } = shouldPlayWindowObjs;

          const startTimeUTC = timeConverter.fromNYCYMDHMSToUTCDate(
            year,
            month,
            date,
            startHour,
            startMinute,
            startSecond,
          );

          const endTimeUTC = timeConverter.fromNYCYMDHMSToUTCDate(
            year,
            month,
            date,
            endHour,
            endMinute,
            endSecond,
          );

          const nowUTC = new Date();

          console.log(startTimeUTC, nowUTC, endTimeUTC);

          if (startTimeUTC.getTime() <= nowUTC.getTime() && nowUTC.getTime() <= endTimeUTC.getTime()) {
            isIn = true;
          }
        }
      });

      return isIn;
    });
  },
};
