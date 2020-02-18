const express = require('express');

const app = express();

module.exports = function() {
  app.get('/dashboard', function (req, res) {
    res.json('Hello World!');
  });

  app.post('/control/shouldStart',  function (req, res) {
    res.json({data: true});
  });

  return app;
};
