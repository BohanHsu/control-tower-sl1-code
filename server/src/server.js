const express = require('express');
const controllers = require('./controllers');

const app = express();

const PORT = process.env.PORT || 3001;

app.use('/api', controllers());

if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, 'client/build')));

  // Handle React routing, return all requests to React app
  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Our app is running on port ${ PORT }`);
});
