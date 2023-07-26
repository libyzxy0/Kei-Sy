const config = {
  name: "Kei", 
  prefix: "¢", 
  active: true, 
  features: {
    emojiReaction: "", 
    greetings: true, 
    antiUnsent: true,
    antiOut: false, 
    welcomeOnGC: true,
    autoReactions: false
  }, 
  api_keys: {
     openai: process.env.OPEN_AI_KEY
  },
  banned: [], 
  admin: [],
  loves: [],
}
module.exports = config;