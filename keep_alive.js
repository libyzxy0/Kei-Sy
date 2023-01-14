const express = require('express');
const app = express();
const config = require('./config.json');

app.get('/', (req, res) => res.send(`${config.botName} is active!`));


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`${config.botName} is listening on port ${port}!`));