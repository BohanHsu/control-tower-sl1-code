const mongoose = require('mongoose');

module.exports = (function () {
  const isPlayingHistorySchema = mongoose.Schema({
    startPlayTime: Date,
    endPlayTime: Date,
  },
  {timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'}});

  const IsPlayingHistory = mongoose.model(
    'is_playing_history',
    isPlayingHistorySchema,
  );

  return IsPlayingHistory;
})();


