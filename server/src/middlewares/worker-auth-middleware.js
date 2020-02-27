const workerService = require('../services/worker-service');

module.exports = function(req, res, next) {
  const identity = req.body.whoami;
  if (!identity) {
    res.sendStatus(403, {});
  }

  let responseData = {};

  workerService.verifyUserByIdentification(identity).then((result) => {
    if (!result) {
      res.sendStatus(403, {});
    }
    next();
  });
};
