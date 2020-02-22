const jwt = require('jsonwebtoken');

module.exports = {
  getLoginToken: (motto) => {
    if (motto === 'test') {
      const token = jwt.sign({motto:"test"}, 'supersecret',{expiresIn: 600});
      return token;
    }

    return null;
  },
};
