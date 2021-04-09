const jwt = require('jsonwebtoken');
const userService = require('./user-service');

module.exports = {
  getLoginToken: (motto, delayExpire=false) => {
    return userService.verifyUserByIdentification(motto)
    .then((verified) => {
      if (verified) {
        const expiresIn = delayExpire ? 864000 : 600;
        const token = jwt.sign({motto, delayExpire}, 'supersecret', {expiresIn});
        return token;
      }

      return null;
    });
  },
};
