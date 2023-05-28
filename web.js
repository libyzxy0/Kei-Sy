
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send({ msg: "Started" })
})

app.get('/restart', (req, res) => {
  res.send("Restarting...");
  res.redirect('/');
  setTimeout(() => {
    process.exit(0)
  }, 1000);
})

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`${config.name} is listening on port ${port}!`));