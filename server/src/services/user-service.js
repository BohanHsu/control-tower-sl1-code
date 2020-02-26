const User = require('../models/user-model');

module.exports = {
  createUser: function(identification) {
    return User.findOne({identification})
    .then((userObj, err) => {
      if (userObj) {
        return null;
      }

      return User.create({
        identification,
      });
    })
    .then((userObj) => {
      return !!userObj;
    });
  },

  verifyUserByIdentification: function(identification) {
    return User.findOne({identification})
    .then((userObj, err) => {
      return !!userObj;
    });
  },
};
