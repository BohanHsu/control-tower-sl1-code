const mongoose = require('mongoose');

module.exports = (function () {
  const shouldPlayWindowSchema = mongoose.Schema({
    startHour: {
      type: Number,
      min: 0,
      max: 23,
      required: true,
    },

    startMinute: {
      type: Number,
      min: 0,
      max: 59,
      required: true,
    },

    startSecond: {
      type: Number,
      min: 0,
      max: 59,
      required: true,
    },

    endHour: {
      type: Number,
      min: 0,
      max: 23,
      required: true,
    },

    endMinute: {
      type: Number,
      min: 0,
      max: 59,
      required: true,
    },

    endSecond: {
      type: Number,
      min: 0,
      max: 59,
      required: true,
    },
  },
  {timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'}});

  const ShouldPlayWindow = mongoose.model(
    'should_play_window',
    shouldPlayWindowSchema,
  );

  return ShouldPlayWindow;
})();
