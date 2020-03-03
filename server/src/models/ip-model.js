const mongoose = require('mongoose');

module.exports = (function () {
  const ipSchema = mongoose.Schema({
    ipAddress: String,
    lastReportAt: Date,
  },
  {timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'}});

  const Ip = mongoose.model(
    'ip',
    ipSchema,
  );

  return Ip;
})();


