const mongoose = require('mongoose');

module.exports = (function () {
  const userSchema = mongoose.Schema({
    identification: String,
  },
  {timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'}});

  const User = mongoose.model(
    'users',
    userSchema,
  );

  return User;
})();

