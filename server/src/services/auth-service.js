const jwt = require('jsonwebtoken');
const userService = require('./user-service');

module.exports = {
  getLoginToken: (motto) => {
    return userService.verifyUserByIdentification(motto)
    .then((verified) => {
      if (verified) {
        const token = jwt.sign({motto}, 'supersecret',{expiresIn: 600});
        return token;
      }

      return null;
    });
  },
};
