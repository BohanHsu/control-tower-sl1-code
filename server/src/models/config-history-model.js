const mongoose = require('mongoose');

module.exports = (function () {
  const configHistorySchema = mongoose.Schema({
    workerReportedConfig: String, // JSON string for config
    pinned: Boolean,
    description: String,
  },
  {timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'}});

  const ConfigHistory = mongoose.model(
    'config_history',
    configHistorySchema,
  );

  return ConfigHistory;
})();


