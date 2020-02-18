const express = require('express');

const dashboardController = require('./dashboard-controller');

const app = express();

module.exports = function() {
  app.get('/dashboard', dashboardController);

  app.post('/control/shouldStart',  function (req, res) {
    res.json({data: true});
  });

  return app;
};
