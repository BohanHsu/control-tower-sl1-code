const express = require('express');
const globalSwitchService = require('../../services/global-switch-service');

const app = express();

module.exports = function() {
  app.post('/globalSwitch', function(req, res) {
    let isOn = false;
    if (req && req.body) {
      isOn = req.body.isOn;
    }
    globalSwitchService.updateGlobalSwitch(isOn).then((result) => {
      res.json({data: {updated: result}});
    })
  });

  return app;
};
