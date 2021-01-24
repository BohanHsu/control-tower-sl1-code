const mongoose = require('mongoose');

module.exports = (function() {
  const oneTimeCommandSchema = mongoose.Schema({
    commandKey: String,
    toSend: Boolean,
  },
  {timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'}});

  const OneTimeCommand = mongoose.model(
    'one_time_command',
    oneTimeCommandSchema,
  );

  return OneTimeCommand;
})();
