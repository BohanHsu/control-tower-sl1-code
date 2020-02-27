const mongoose = require('mongoose');

module.exports = (function () {
  const workerSchema = mongoose.Schema({
    identification: String,
  },
  {timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'}});

  const Worker = mongoose.model(
    'workers',
    workerSchema,
  );

  return Worker;
})();

