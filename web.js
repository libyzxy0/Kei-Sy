const express = require('express');
const app = express();
const config = require('./config.js');
const cors = require('cors');
const axios = require("axios")
const fs = require("fs")



function sendmail(target, title, message, subject) {
  axios.post('https://libyzxy0-mailer.libyzxy0-edu.repl.co/api/sendmail', {
    target, 
    title, 
    message, 
    subject
  })
  .then((response) => {
    console.log("Email sent")
  })
  .catch((error) => {
    console.log(error);
  });
}



app.use(cors())
app.use(express.static(__dirname + '/public'))
app.use(express.json())
app.use(express.urlencoded({extended: true }))

app.get('/registeredUsersList', (req, res) => {
  let key = req.query.key;
  if(key != process.env.USERS_LIST_KEY || !key) {
    res.send("Invalid key!")
  } else {
  let users = require("./data/registeredUsers.json");
  res.type('json').send(JSON.stringify(users, null, 2) + '\n');
   }
})

app.post('/api/gptAPI', (req, res) => {
  let { KeiAI } = require("./kei.js")
  let { message, key } = req.body;
  console.log(message)
  if(!key.endsWith('288101')) {
    res.send({ response: "gago bobo mali yung key!" });
  } else {
    let ai = new KeiAI("Kei Sy");
    ai.createChatCompletion(message, (resp) => {
      res.send({ response: resp, msg: "gago ampogi ni liby!" });
    })
  }
}) 

app.post('/hcaptcha-verify', (req, res) => {
  axios.post('https://hcaptcha.com/siteverify', {
    secret: "0x86dc8Ea796CCD22c0F3aB87E842b664930e669C20x86dc8Ea796CCD22c0F3aB87E842b664930e669C2", 
    response: "success"
  })
  .then((res) => {
    console.log(res.data);
    res.send(res.data)
  })
  .catch((error) => {
    console.log(error);
    res.send(error)
  });
})
    

app.post('/register', (req, res) => {
   const path = __dirname + "/data/registeredUsers.json";
  let registeredUsers = JSON.parse(fs.readFileSync(path));
  //Varriables
	let { firstName, lastName, email, fbUrl, message } = req.body;
  let uid = axios.get('https://sampleapi-mraikero-01.vercel.app/get/fbuid?url=' + fbUrl);
  uid.then((response) => {
  let data = {
    firstName, 
    lastName, 
    email, 
    uid: response.data.uid,
    url: fbUrl, 
    message 
  }
  if(req.body) {

    function push(array, item) {
        if (!array.find(({ uid }) => uid === item.uid)) {
          array.push(item);
          fs.writeFileSync(path, JSON.stringify(array, null, 2));
          console.log({ message: "success" })
        } else {
          console.log({ message: "error" })
        }
    }
    push(registeredUsers, data);

    sendmail(data.email, `Hello ${data.firstName}!`, "Thank you for registering to our messengerchatbot named Kei Sy!", "Message from Kei Sy");

    sendmail("janlibydelacosta@gmail.com", `Hello Liby!`, `One user registered: <br>Name: ${data.firstName} ${data.lastName}<br>Email: ${data.email}<br>Url: ${data.url}<br>Reason: ${data.message}`, "Message from Kei Sy");
    
    setTimeout(() => {
      process.exit(0)
    }, 1000)
    console.log(data)
    res.status(200).json({ msg: "Success" })
  } else {
    res.status(400).json({ msg: "Failed" })
  }
 })
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
