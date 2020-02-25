const jwt = require('jsonwebtoken');
const authService = require('../services/auth-service');

module.exports = function(req, res, next) {
  const token = req.header('token');
  jwt.verify(token, 'supersecret', function(err, decoded){
    if(!err){
      const motto = decoded.motto;
      const newToken = authService.getLoginToken(motto);

      if (res.locals) {
        res.locals.newToken = newToken;
      }
      
      next();
    } else {
      res.sendStatus(403, {});
    }
  });
};
