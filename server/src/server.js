const controllers = require('./controllers');
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const https = require('https');
const fs = require('fs');

const app = express();

const PORT = process.env.PORT || 3001;

app.use('/api', controllers());

if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, '../..', 'client/build')));

  // Handle React routing, return all requests to React app
  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, '../..', 'client/build', 'index.html'));
  });
}

const MONGODB_URL =
  process.env.MONGOLAB_URI ||
  process.env.MONGOHQ_URL ||
  process.env.MONGODB_URI ||
  process.env.ATLAS_URI ||
  'mongodb://localhost/control-tower';

console.log(MONGODB_URL);

mongoose.connect(MONGODB_URL);

mongoose.connection.on('connected', function () {
  console.log('mongodb is on!');
});

mongoose.connection.on('error', function (err) {
  console.log('mongodb encounter an error!');
  console.log(err);
});

app.listen(PORT, () => {
  console.log(`Our app is running on port ${ PORT }`);
});

if (process.env.NODE_ENV !== 'production') {
  // localhost

  let privateKey  = fs.readFileSync('../../ssl/selfsigned.key', 'utf8');
  let certificate = fs.readFileSync('../../ssl/selfsigned.crt', 'utf8');
  const credentials = {key: privateKey, cert: certificate};
  const httpsServer = https.createServer(credentials, app);
  httpsServer.listen(8443);
}
