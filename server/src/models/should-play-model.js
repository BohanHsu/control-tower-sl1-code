const mongoose = require('mongoose');

module.exports = (function () {
  const shouldPlaySchema = mongoose.Schema({
    shouldPlay: Boolean,
    shouldPlayWindow: Boolean,
  },
  {timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'}});

  const ShouldPlay = mongoose.model(
    'should_play',
    shouldPlaySchema,
  );

  return ShouldPlay;
})();

