const mongoose = require('mongoose');

module.exports = (function () {
  const configSchema = mongoose.Schema({
    sendToWorker: Boolean,
    humanOverrideConfig: String, // JSON string for config
    humanOverrideConfigLastUpdateTime: Date,
    workerReportedConfig: String, // JSON string for config
    workerReportedAvailableMp3Files: [String],
    workerReportConfigTime: Date,
  },
  {timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'}});

  const Config = mongoose.model(
    'config',
    configSchema,
  );

  return Config;
})();

