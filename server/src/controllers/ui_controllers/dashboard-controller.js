const shouldPlayService = require('../../services/should-play-service');

module.exports = function (req, res) {
  shouldPlayService().then((shouldPlayObj) => {
    res.json(shouldPlayObj);
  });
};
