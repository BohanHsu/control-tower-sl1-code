const jwt = require('jsonwebtoken');
const authService = require('../services/auth-service');

module.exports = function(req, res, next) {
  const token = req.header('token');
  jwt.verify(token, 'supersecret', function(err, decoded){
    if(!err){
      const motto = decoded.motto;
      const delayExpire = !!decoded.delayExpire;

      authService.getLoginToken(motto, delayExpire).then((newToken) => {
        if (newToken) {
          if (res.locals) {
            res.locals.newToken = newToken;
          }

          next();
        } else {
          res.sendStatus(403, {});
        }
      });
    } else {
      res.sendStatus(403, {});
    }
  });
};
