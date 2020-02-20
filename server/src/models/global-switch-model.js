const mongoose = require('mongoose');

module.exports = (function () {
  const globalSwitchSchema = mongoose.Schema({
    isOn: Boolean,
  },
  {timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'}});

  const GlobalSwitch = mongoose.model(
    'global_switch',
    globalSwitchSchema,
  );

  return GlobalSwitch;
})();

