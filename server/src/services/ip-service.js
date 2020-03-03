const Ip = require('../models/ip-model');

module.exports = {
  queryIp: function() {
    return Ip.findOne().then((ipObj) => {
      if (ipObj) {
        return ipObj;
      }
      return null;
    });
  },

  updateIp: function(ipAddress) {
    Ip.findOne().then((ipObj) => {
      if (!ipObj) {
        return Ip.create({
          ipAddress,
          lastReportAt: new Date(),
        });
      } else {
        ipObj.ipAddress = ipAddress;
        ipObj.lastReportAt = new Date();
        return ipObj.save();
      }
    });
  },
};
