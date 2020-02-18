const express = require('express');
const controllers = require('./controllers');

const app = express();
const port = 3000;

app.use('/', controllers());

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
