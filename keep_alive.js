const express = require('express');
const app = express();
const config = require('./config.json');
const moment = require('moment-timezone');
moment.tz.setDefault('Asia/Manila');
let mt = moment();
let time = `${mt}`;

app.get('/', (req, res) => {
  res.type('json').send(JSON.stringify({ name: config.botName, active: config.isActive, started: time }, null, 2) + '\n');
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`${config.botName} is listening on port ${port}!`));
