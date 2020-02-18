const express = require('express');
const controllers = require('./controllers');

const app = express();

const PORT = process.env.PORT || 3000;

app.use('/', controllers());

app.listen(PORT, () => {
      console.log(`Our app is running on port ${ PORT }`);
});
