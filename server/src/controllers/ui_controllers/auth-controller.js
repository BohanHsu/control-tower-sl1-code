const express = require('express');

const authService = require('../../services/auth-service');

const app = express();

module.exports = function() {
  app.post('/login', function(req, res) {
    let motto = null;
    if (req && req.body) {
      motto = req.body.motto;
    }

    const token = authService.getLoginToken(motto);

    res.json({data: {token}});
  });

  return app;
};
