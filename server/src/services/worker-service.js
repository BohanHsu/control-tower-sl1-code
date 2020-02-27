const Worker = require('../models/worker-model');

module.exports = {
  createWorker: function(identification) {
    return Worker.findOne({identification})
    .then((workerObj, err) => {
      if (workerObj) {
        return null;
      }

      return Worker.create({
        identification,
      });
    })
    .then((workerObj) => {
      return !!workerObj;
    });
  },

  verifyUserByIdentification: function(identification) {
    return Worker.findOne({identification})
    .then((workerObj, err) => {
      return !!workerObj;
    });
  },
};
