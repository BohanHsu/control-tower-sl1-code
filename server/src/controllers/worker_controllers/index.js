const express = require('express');

const app = express();

module.exports = function() {
  app.post('/ping', function (req, res) {
    res.json({shouldPlay: false});
  });

  return app;
};
