const config = {
  name: "Kei", 
  prefix: "¢", 
  active: true, 
  features: {
    emojiReaction: "", 
    greetings: false, 
    antiUnsent: true,
    antiOut: false, 
    welcomeOnGC: true,
    autoReactions: false
  }, 
  api_keys: {
     openai: process.env.OPEN_AI_KEY
  },
  banned: require("./cache/bannedUsers.json"), 
  admin: require("./cache/admins.json"),
  loves: require("./cache/loveUsers.json"), 
  registeredUsers: require("./data/registeredUsers.json")
}
module.exports = config;
