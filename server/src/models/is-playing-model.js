const mongoose = require('mongoose');

module.exports = (function () {
  const isPlayingSchema = mongoose.Schema({
    isPlaying: Boolean,
    lastWorkerReportTime: Date,
  },
  {timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'}});

  const IsPlaying = mongoose.model(
    'is_playing',
    isPlayingSchema,
  );

  return IsPlaying;
})();

