const mongoose = require('mongoose');
const workerService = require('../services/worker-service');

const MONGODB_URL =
  process.env.MONGOLAB_URI ||
  process.env.MONGOHQ_URL ||
  process.env.MONGODB_URI ||
  'mongodb://localhost/control-tower';

console.log(MONGODB_URL);

mongoose.connect(MONGODB_URL);

mongoose.connection.on('connected', function () {
  console.log('mongodb is on!');
});

workerService.createWorker(process.argv[2])
.then((res) => {
  console.log(res);
});
