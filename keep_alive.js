const express = require('express');
const app = express();

app.get('/', (req, res) => res.send('Active...'));

app.listen(() =>
	console.log("Listening...")
);