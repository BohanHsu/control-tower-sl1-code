const mongoose = require('mongoose');

module.exports = (function () {
  const duangRequestSchema = mongoose.Schema({
    requestedAt: Date,
    scheduleDuangTime: Date,
    sentToWorkerAt: Date,
    requestClosedAt: Date,
    currentState: {
      type: String,
      enum: [
        'notHandleYet', // no worker queried control tower since this request created
        'serverRejected', // server rejected this request when worker query the control tower
        'sentToWorker', // server sent the request to worker, wait for worker to response
        'workerRejected', // worker rejected this duang request
        'duangPlayed', // worker report the duang request was played
        'manualRejected', // hunam stopped the duang request from UI, this can only happend before request send to worker
      ],
      default: 'notHandleYet',
    },
    rejectReason: String,
  },
  {timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'}});

  const DuangRequest = mongoose.model(
    'duang_request',
    duangRequestSchema,
  );

  return DuangRequest;
})();


