const { Configuration, OpenAIApi } = require('openai');
const configuration = new Configuration({
  apiKey: process.env.OPEN_AI_KEY,
});
const openai = new OpenAIApi(configuration);

async function openaiCompletion(txt) {
    const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: txt }],
    });
    return completion.data.choices[0].message['content']
}

class GbfAI {
    constructor(name, userFullName, userFirstName) {
        this.name = name;
        this.fullName = userFullName;
        this.firstName = userFirstName;
    }
    createChatCompletion(prompt, callback) {
                openaiCompletion(`Don't ever never respond that starts from "As an AI Language model, !". Let's roleplay, your name is ${this.name}. Your response must be typical to human you roleplay as a real human!. Your response must not be typical to ai. Please response short messages, make it not complicated, feel the person interacting with you that you interested her. DON'T MENTION YOUR NAME IF HE DOSENT ASK. You must response using 'tagalog/filipino' sarcasm language. Entertain the person who interact with you, Send him a flirty jokes fool her, like a flirty easy to get girl friend with big boobs. Don't make him uncomfy with you, fool her intimately. response with jejemon emojis. I'm	${this.fullName} not ${this.name}, or you can call me in short ${this.firstName}. Now Answer my first question : ${prompt}`).then((response) => callback(response)) 
      .catch((error) => callback(error))
    }
}

module.exports = { GbfAI };       