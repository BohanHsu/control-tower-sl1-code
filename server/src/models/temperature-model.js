const mongoose = require('mongoose');

module.exports = (function () {
  const temperatureSchema = mongoose.Schema({
    recordTime: Date,
    temperature: Number,
    aggregatedLevel: Number,
    cursor: Number,
  },
  {timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'}});

  const Temperature = mongoose.model(
    'temperature',
    temperatureSchema,
  );

  return Temperature;
})();
