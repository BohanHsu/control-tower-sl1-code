const moment = require('moment-timezone');

module.exports = {
  fromNYCYMDHMSToUTCDate: function(year, month, date, hour, minute, second) {
    if (month <= 9) {
      month = `0${month}`;
    }

    if (date <= 9) {
      date = `0${date}`;
    }

    if (hour <= 9) {
      hour = `0${hour}`;
    }

    if (minute <= 9) {
      minute = `0${minute}`;
    }

    if (second <= 9) {
      second = `0${second}`;
    }

    const timeFormatString = `${year}-${month}-${date}T${hour}:${minute}:${second}`

    const newYorkMoment = moment.tz(timeFormatString, "America/New_York");

    const utcTimeString = newYorkMoment.utc().format();

    const utcTime = new Date(utcTimeString);
    return utcTime;
  },

  currentYMDAtNY: function() {
    const nytString = moment().tz("America/New_York").format('YYYY:MM:DD');
    console.log('xbh2', nytString);
    const nytArray = nytString.split(':');
    const year = parseInt(nytArray[0]);
    const month = parseInt(nytArray[1]);
    const date = parseInt(nytArray[2]);

    return {
      year,
      month,
      date,
    };
  },
};
