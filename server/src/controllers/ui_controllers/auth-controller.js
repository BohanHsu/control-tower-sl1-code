const express = require('express');

const authService = require('../../services/auth-service');

const app = express();

module.exports = function() {
  app.post('/login', function(req, res) {
    let motto = null;
    let delayExpire = false;
    if (req && req.body) {
      motto = req.body.motto;
      delayExpire = !!req.body.showHint;
    }

    authService.getLoginToken(motto, delayExpire)
    .then((token) => {
      res.json({data: {token}});
    });
  });

  return app;
};
