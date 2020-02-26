const express = require('express');

const authService = require('../../services/auth-service');

const app = express();

module.exports = function() {
  app.post('/login', function(req, res) {
    let motto = null;
    if (req && req.body) {
      motto = req.body.motto;
    }

    authService.getLoginToken(motto)
    .then((token) => {
      res.json({data: {token}});
    });
  });

  return app;
};
