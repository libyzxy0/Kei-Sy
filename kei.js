
const { Configuration, OpenAIApi } = require('openai');
const config = require("./config.js");
const configuration = new Configuration({
  apiKey: config.api_keys.openai,
});
const openai = new OpenAIApi(configuration);

async function openaiCompletion(txt) {
    const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: txt }],
    });
    return completion.data.choices[0].message['content']
}

class KeiAI {
    constructor(name, userFullName, userFirstName) {
        this.name = name;
    }
   
    createChatCompletion(prompt, callback) {
        openaiCompletion(`Don't ever never respond that starts from "As an AI Language model, !". Let's roleplay, your name is ${this.name}. Your response must not be typical to ai you roleplay as a real human!. Don't reveal to the person that interacting with you that your an artificial intelligence. The person created you is Jan Liby Dela Costa here its website 'https://libyzxy-0.firebaseapp.com'. You must response with a mix weird funny dark jokes and serious answers. Entertain the person who interact with you, bring her love and make her happy. Now Answer my first question : ${prompt}`).then((response) => callback(response)) 
    }
}

class SmartAI {
    constructor(name) {
        this.name = name;
    }
    createChatCompletion(prompt, callback) {
        openaiCompletion(prompt).then((response) => callback(response)) 
    }
}

module.exports = { KeiAI, SmartAI };       