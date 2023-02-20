const fs = require("fs");
const http = require('https');
const login = require("fca-unofficial");
const axios = require("axios");
const request = require('request');
const cron = require('node-cron');
const moment = require('moment-timezone');
const { Configuration, OpenAIApi } = require("openai");
const Innertube = require("youtubei.js");
const { keep_alive } = require("./keep_alive.js");
const cd = {};
const msgs = {};
const config = require('./config.json');
const { prefix, admin, loves, greet, banned, botName } = config;
const openaiPrefix = botName.toLowerCase();
/*=======Note=======

Bot id must be put in admin[0] index!
Primary admin id must be put in the admin[1] index!
Normal admins id starts from admin[2] and so far, so on!

Thankyou for using my code!
— libyzxy0

https://liby0.vercel.app
*/

async function getWiki(q) {
  out = await axios.get("https://en.wikipedia.org/api/rest_v1/page/summary/" + q).then((response) => { return response.data}).catch((error) => { return error })
  return out
}

async function qt() {
    let qoute = await axios.get("https://zenquotes.io/api/random").then((response) => { return response.data[0] }).catch((err) => { return "err " });
    return qoute
}

async function qouteOfTheDay() {
    let qoute = await axios.get("https://api.libyzxy0.repl.co/api/quotes/today").then((response) => {
      return response.data
    }).catch((err) => {
      return null
    });
    return qoute
  }


async function verse(){
    let v = await axios.get("http://labs.bible.org/api/?passage=random&type=json").then((response) => {
        return response.data[0]
    }).catch((err) => {
        return "Error"
    })
    return v
}
const configuration = new Configuration({
  apiKey: process.env.OPEN_AI_KEY=config.api_keys.openai,
});

async function aiImage(prompt_msg){
const openai = new OpenAIApi(configuration);
const response = await openai.createImage({
  prompt: prompt_msg,
  n: 1,
  size: "1024x1024",
});
return response.data;
}

login({ appState: JSON.parse(fs.readFileSync('appstate.json', 'utf8')) }, (err, api) => {
    if (err) return console.error(err);
    api.setOptions({ listenEvents: true });
if(config.isActive) {
if(config.greetings) {

cron.schedule('0 6 * * *', () => {
	api.getThreadList(100, null, ["INBOX"], (err, data) => {
		data.forEach(info => {
		if (info.isGroup && info.isSubscribed) {
			let a = qouteOfTheDay();
            a.then((response) => {
            if(response.code == 200) {
            	api.sendMessage(`｢Quote of the day｣\n\n${response.result.quote}\n\n— ${response.result.author}`, info.threadID);
            } else {
            	api.sendMessage("Quote of the day has been error!", admin[1]);
            }
            	 
            })
		}
	  }) 
	})
},{
	schedule: true, 
	timezone: "Asia/Manila" 
});

cron.schedule('0 7 * * *', () => {
	api.getThreadList(100, null, ["INBOX"], (err, data) => {
		data.forEach(info => {
		if (info.isGroup && info.isSubscribed) {
		api.sendMessage("Good Morning Everyone! Start each day with a grateful heart and watch your life transform.\n\n~Auto Greet~", info.threadID);
		}
	  }) 
	})
},{
	schedule: true, 
	timezone: "Asia/Manila" 
});

cron.schedule('0 12 * * *', () => {
	api.getThreadList(100, null, ["INBOX"], (err, data) => {
		data.forEach(info => {
		if (info.isGroup && info.isSubscribed) {
		api.sendMessage("Good Afternoon Everyone! May the afternoon bring you peace and joy, and may your day be filled with sunshine.\n\n~Auto Greet~", info.threadID);
		}
	  }) 
	})
},{
	schedule: true, 
	timezone: "Asia/Manila" 
});

cron.schedule('0 19 * * *', () => {
	api.getThreadList(100, null, ["INBOX"], (err, data) => {
		data.forEach(info => {
		if (info.isGroup && info.isSubscribed) {
		api.sendMessage("Good Evening Everyone! Evening brings the promise of tomorrow's possibilities. May you find peace and joy in the night.\n\n~Auto Greet~", info.threadID);
		}
	  }) 
	})
},{
	schedule: true, 
	timezone: "Asia/Manila" 
});

cron.schedule('0 22 * * *', () => {
	api.getThreadList(100, null, ["INBOX"], (err, data) => {
		data.forEach(info => {
		if (info.isGroup && info.isSubscribed) {
		api.sendMessage("Good Night Everyone! Sleep tight. May your dreams be filled with delight.\n\n~Auto Greet~", info.threadID);
		}
	  }) 
	})
},{
	schedule: true, 
	timezone: "Asia/Manila" 
});

}
} 

moment.tz.setDefault('Asia/Manila');
const currentDateTime = moment();
api.sendMessage(`${botName} started at ${currentDateTime}`, admin[1]);


const listenEmitter = api.listen(async (err, event) => {
    if (err) return console.log(err);     
        switch (event.type) {
        	case "event":
        if(config.isActive) {
                switch (event.logMessageType) {
                    case "log:subscribe":
if(config.welcomeOnGC) {
api.getThreadInfo(event.threadID, (err, data) => {
var gcName = data.threadName;
let id =  event.logMessageData.addedParticipants[0].userFbId
let botID = api.getCurrentUserID();
var userIDs = data.participantIDs;
var members = userIDs.length;
//Custom gc noti                           
if(event.threadID == "5572548646186754") {
api.sendMessage({
	body: `Hi there, ` + event.logMessageData.addedParticipants[0].fullName + ` Welcome to this gc ${gcName}\n\n｢Heres the rules｣\n\nYou should follow/obey the Rules if you want to stay\n\n» Allowed\n\n• Programming topics\n• Programming memes\n• Sharing ideas about programming\n• Asking help about programming\n\n» Not Allowed\n\n• Spamming of messages\n• Bullying Others\n• Flirting\n\n\n— Kei Sy`,
	mentions: [{
		tag: event.logMessageData.addedParticipants[0].fullName,
         id: id,
         fromIndex: 0
    }]
}, event.threadID);
} else if (event.threadID == "9471097392915943") {
api.sendMessage({
	body: `Welkam ` + event.logMessageData.addedParticipants[0].fullName + ` putanginamoo🖕🖕`,
	mentions: [{
		tag: event.logMessageData.addedParticipants[0].fullName,
         id: id,
         fromIndex: 0
    }]
}, event.threadID);
} else {
	
//End custom gc noti
if (data.isGroup) {
if (id == botID) {
api.changeNickname(`｢${prefix}｣ ${botName}`, event.threadID, botID, (err) => {
	if (err) return console.error(err);
});
api.sendMessage({
body: `Helloo, thanks for adding me in this gc!`
}, event.threadID);
} else {
var url = `https://api.reikomods.repl.co/canvas/welcome?uid=${id}&name=${event.logMessageData.addedParticipants[0].fullName}&bg=https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHgPjRNea4FNsnCcFy00ILm0PnsmisR-E40tlRbhadKxtS0PNDFG1ASsYU&s=10&namegc=${gcName}&member=${members}`;
var file = fs.createWriteStream("cache/join.png");http.get(url, function (rqs) {
rqs.pipe(file);
file.on('finish', function () {
	let mess = {
		body: `Hi there, ${event.logMessageData.addedParticipants[0].fullName} 😊\n┌────── ～●～ ──────┐\n─── Welcome to ${gcName} ───\n└────── ～●～ ──────┘\nYour'e the ${members}th member of this gc!`,
        mentions: [{
        	tag: event.logMessageData.addedParticipants[0].fullName,
            id: id
        }], 
        attachment: fs.createReadStream(__dirname + '/cache/join.png')
     }
     api.sendMessage(mess, event.threadID);
     })
    }) 
   } 
  }


} //threadid condition end bracket                     
                            
 }) 
}  
               break;
                 case "log:unsubscribe":
var id = event.logMessageData.leftParticipantFbId;
api.getThreadInfo(event.threadID, (err, gc) => {
if (err) return console.log(err);
api.getUserInfo(parseInt(id), (err, data) => {
if (err) {
console.log(err)
} else {
for (var prop in data) {
if (data.hasOwnProperty(prop) && data[prop].name) {
var gcName = gc.threadName;
var userIDs = gc.participantIDs;
var members = userIDs.length;

if(config.welcomeOnGC) {
	
if(event.threadID == "9471097392915943") {
	api.sendMessage({
    body: `‎Tanginamo, ${data[prop].name} bat ka nag leavee!??!!, pakyoo🖕🖕`,
    mentions: [{
    tag: data[prop].name,
    id: id,
}]
}, event.threadID)
} else {
	
var url = `https://api.reikomods.repl.co/canvas/goodbye2?name=${data[prop].firstName}&uid=${id}&bg=https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHgPjRNea4FNsnCcFy00ILm0PnsmisR-E40tlRbhadKxtS0PNDFG1ASsYU&s=10&member=${members}`;
var file = fs.createWriteStream("cache/leave.png");
http.get(url, function (rqs) {
rqs.pipe(file);
file.on('finish', function () {
api.sendMessage({
    body: `‎Bye😞, ${data[prop].name} has left from the group '${gcName}', we will miss you!`,
    mentions: [{
    tag: data[prop].name,
    id: id,
}],
attachment: fs.createReadStream(__dirname + '/cache/leave.png')
}, event.threadID)
	})
  }) 
} 

if(config.antiOut) {                                               
setTimeout(() => {
	api.addUserToGroup(id, event.threadID, (err,data) => {
	if (err) return api.sendMessage("[Antiout] » Err, cant add user to the group!");
    })
api.sendMessage({
    body: `[Antiout] » ` + data[prop].name + ` has been re-added to the group ${gcName}!`,
    mentions: [{
    	tag: data[prop].name,
        id: id
    }]
}, event.threadID);
}, 5000);
}                                            
                                            }
                                        }
                                    }
                                    
                                   } //custom leave gc noti bracket end
                                })
                            })
                        break;
                  } 
              } 
                break;
        	
        	case "message_reply":
        if(config.isActive) {
        if(!banned.includes(event.senderID)) {
        let input = event.body;
        let msgid = event.messageID;
        msgs[msgid] = input;

if (input.startsWith(`${prefix}getlink`)) {
	const tinyurl = require("tinyurl");
	if (event.type != "message_reply") return
    if (event.messageReply.attachments.length < 1) {
    	api.sendMessage("err", event.threadID, event.messageID);
    } else if ((event.messageReply.attachments.length === 1)) {
    	const url = event.messageReply.attachments[0].url;
        var a = await tinyurl.shorten(url);
            api.sendMessage(a, event.threadID, event.messageID);
    }
}

if (input.startsWith(`${prefix}pin`)) {
    	api.getUserInfo(event.messageReply.senderID, (err, info) =>{
    	api.getUserID(event.messageReply.messageID, (err, data) =>{
        const newObject = {
        	msg: event.messageReply.body,
            name: info[event.messageReply.senderID].name, 
            id: event.messageReply.senderID
        }
        fs.writeFile('./cache/pinned.json', JSON.stringify(newObject), err => {
        	if(err) {
        	console.log(err)
            } else {
          	api.sendMessage("Message was successfully pinned!", event.threadID, event.messageID) 
        	}
  })    
 })   
})  	
}

else if(input.startsWith(`${prefix}unsent`)){
              let data = input.split(" ");
              if(data.length < 5){
                api.getUserInfo(event.senderID, (err, data) => {
                  if (err) return console.error(err);
                  else {
                   
                    api.getUserID(event.messageReply.messageID, (err,data) =>{
                    	
                      api.unsendMessage(event.messageReply.messageID);
                      
                      if (event.messageReply.senderID != api.getCurrentUserID())
                        return api.sendMessage("[ ERR ] Can't unsent message that aren't from the bot!", event.threadID, event.messageID);
                    });
                  }
                });
              }
  }
 }  
} 

            case "message":
            if(!banned.includes(event.senderID)) {
            
                  if (admin.includes(event.senderID)) {
                  	if(config.isActive) {
                  	if(config.autoReactions) {
                     api.setMessageReaction("", event.messageID, (err) => {}, true);
                    } 
                   } 
                  }
                  else if (loves.includes(event.senderID)) {
                  	if(config.isActive) {
                  	if(config.autoReactions) {
                     api.setMessageReaction("🩷", event.messageID, (err) => {}, true);
                    } 
                   }
                  } else {
                  	if(config.isActive) {
                  	if(config.autoReactions) {
                     api.setMessageReaction(`${config.emojiReaction}`, event.messageID, (err) => {}, true);
                    } 
                   } 
                  }
                  
                if (event.attachments.length != 0) {
                    if (event.attachments[0].type == "photo") {
                        msgs[event.messageID] = ['img', event.attachments[0].url]
                    }
                    else if (event.attachments[0].type == "animated_image") {
                        msgs[event.messageID] = ['gif', event.attachments[0].url]
                    }
                     else if (event.attachments[0].type == "sticker") {
                        msgs[event.messageID] = ['sticker', event.attachments[0].url]
                    }
                    else if (event.attachments[0].type == "video") {
                        msgs[event.messageID] = ['vid', event.attachments[0].url]
                    }
                    else if (event.attachments[0].type == "audio") {
                        msgs[event.messageID] = ['vm', event.attachments[0].url]
                    }
                } else {
                    msgs[event.messageID] = event.body
                }
                
                if (event.body != null) {
                let input = event.body;      
                
if(input.startsWith(`${prefix}`)) {
if(config.isActive != true) {
		api.getUserInfo(event.senderID, (err, data) => {
		if (err) return console.log(err)
		else {
		api.sendMessage({
        	body: `Sorry, ` + data[event.senderID]['firstName'] + ` ${botName} is temporary unavailable☹️☹️`, 
            attachment: fs.createReadStream(__dirname + '/unavailable.png'), 
            mentions: [{
            	tag: data[event.senderID]['firstName'],
                id: event.senderID,
                fromIndex: 0
                }]
        }, event.threadID, event.messageID);
        } 
    })    
  }
} 
if(config.isActive) {   
 
if(input.startsWith(`${prefix}help`)) {
	let data = input.split(`${prefix}help `)
    let rqt = qt();
    rqt.then((response) => {
    let cmdLength = '6';
    var msg = `｢${botName} Commands｣\n`;
    var defaultPage = `\n\n• ${prefix}meme [nqr]\n\n• ${prefix}aniqoute [nqr]\n\n• ${prefix}gelbooru [nqr]\n\n• ${prefix}pickupline [nqr]\n\n• ${prefix}shoti [nqr]\n\n• ${prefix}groups [nqr]\n\n• ${prefix}bible [nqr]\n\n• ${prefix}info [nqr]\n\n• ${prefix}catfact [nqr]\n\n• ${prefix}dogfact [nqr]\n\n\n• Page » [1/${cmdLength}]`;
    
    if(data[1] == 1) {
    	msg += `${defaultPage}`;
    } else if(data[1] == 2) {
    	msg += `\n\n• ${prefix}cbinary [bin]\n\n• ${prefix}binary [txt]\n\n• ${prefix}repeat [txt]\n\n• ${prefix}uid [tag]\n\n• ${prefix}play [txt]\n\n• ${prefix}unsent [rep]\n\n• ${prefix}fact [txt]\n\n• ${prefix}wiki [txt]\n\n• ${prefix}bonk [tag]\n\n• ${prefix}gid [nqr]\n\n\n• Page » [2/${cmdLength}]`;
    
    } else if (data[1] == 3) {
        msg += `\n\n• ${prefix}kiss [nqr]\n\n• ${prefix}${openaiPrefix} [ask]\n\n• ${prefix}baybayin [txt]\n\n• ${prefix}morse [txt]\n\n• ${prefix}biden [txt]\n\n• ${prefix}say [txt]\n\n• ${prefix}setname [tag] [txt] \n\n• ${prefix}tiktokdl [url]\n\n• ${prefix}doublestruck [txt]\n\n• ${prefix}generate[txt]\n\n\n• Page » [3/${cmdLength}]`;
        
    } else if (data[1] == 4) {
        msg += `\n\n• ${prefix}pin [rep]\n\n• ${prefix}showpinned [nqr]\n\n• ${prefix}periodic [txt]\n\n• ${prefix}signs [nqr]\n\n• ${prefix}qr [txt]\n\n• ${prefix}cuddle [nqr]\n\n• ${prefix}video [txt]\n\n• ${prefix}meow [nqr]\n\n• ${prefix}kick [tag]\n\n• ${prefix}report [msg]\n\n\n• Page » [4/${cmdLength}]`;
        
    } else if (data[1] == 5) {
        msg += `\n\n• ${prefix}setall [txt]~\n\n• ${prefix}lulcat [txt]\n\n• ${prefix}help [num]\n\n• ${prefix}getlink [rep]\n\n• ${prefix}peeposign [txt]\n\n• ${prefix}send [uid]_[msg]\n\n• ${prefix}bigtext [txt]\n\n• ${prefix}pet [txt]\n\n• ${prefix}lyrics [txt]\n\n• ${prefix}sendall [msg]~\n\n\n• Page » [5/${cmdLength}]`;
        
    } else if (data[1] == 6) {
        msg += `\n\n• ${prefix}sendallgc [txt]~\n\n• ${prefix}renamebot [txt]~\n\n\n• Page » [6/${cmdLength}]`;
        
    } else {
    	msg += `${defaultPage}`;
    }
   msg += `\n\nQOTD » ${response.q}`
   
   api.sendMessage(msg, event.threadID, event.messageID)
    }) 
}  

//=======Special Features Here!=======\\



//=======End Special Features Here!=======\\



else if (input.startsWith(`${prefix}info`)) {
	let data = input.split(" ");
    if (data.length < 2) {
    	api.sendMessage({
    	body: `｢${botName} Info｣\n\n${botName} is a Facebook messenger chat bot made using NodeJS, this bot is built to help other people to their activities, and to make happy.\n\nCreated by ` + 'Jan Liby Dela Costa' + `\n\n｢${botName} Features｣\n\n» Anti Unsent\n\n» Auto Reaction\n\n» Answer Any Questions\n\n» Auto Greet\n\n» Solving Math\n\n» Fun\n\n｢Api Used｣\n\n» Fca-unofficialAPI\n\n» SomerandomAPI\n\n» Simsimini.netAPI\n\n» ZenquotesAPI\n\n» OpenAiAPI\n\n» ManhictAPI\n\n» PopcatxyzAPI\n\n» Bible.orgAPI\n\n» Saiki Desu API\n\n» WikipediaAPI\n\n» VacepronAPI\n\n｢Credits to this Developers｣\n\n» Marvin Saik\n\n» Mark Agero\n\n» John Paul Caigas\n\n» Earl Shine Sawir\n\n» Lester Navara\n\n» Salvador\n\n» Eljohn Monzales Mago`,
        mentions: [{
        	tag: 'Jan Liby Dela Costa',
            id: admin[1],
        }]
        }, event.threadID,event.messageID);
   }
}  

else if (input.startsWith(`${prefix}signs`)) {
	let message = `｢${botName} Signs｣\n\n\n｢txt｣\n–This means you have to input a plain text query.\n\n｢msg｣\n–This means you have to input a message query.\n\n｢uid｣\n–This means you have to input a userID query.\n\n｢num｣\n–This means you have to input an number.\n\n｢rep｣\n–This means you have to reply a message.\n\n｢~｣\n–This means this command is for admin only.\n\n｢nqr｣\n–This means is No Query Required.`;
	api.sendMessage(message, event.threadID, event.messageID);
}                        
else if (input.startsWith(`${prefix}configuration`)) {                        
	api.sendMessage(`｢${botName} Config｣\nName » ${botName}\n｢Features｣\n• Active » ${config.isActive}\n• Greetings » ${config.greetings}\n• Anti Unsent » ${config.antiUnsent}\n• Anti Out » ${config.antiOut}\n• Join Notif » ${config.welcomeOnGC}\n• Auto Reactions » ${config.autoReactions}`, event.threadID);
} 
else if (input.startsWith(`${botName}`)) {
	let data = input.split(" ");
    if (data.length < 2) {
    if (loves.includes(event.senderID)) {
    	api.setMessageReaction("💙", 
event.messageID, (err) => {}, true);
        api.sendMessage("Bakit po lolovess?", event.threadID, event.messageID);
	} else {
		api.setMessageReaction("👍", event.messageID, (err) => {}, true);
		api.sendMessage("Bakit nanaman, tanginamo!!??!", event.threadID, event.messageID);
    }
    } else {
    	let txt = input.substring(botName.length + 1)
	    let a = axios.get(`https://api.libyzxy0.repl.co/api/simsimi?message=${txt}`)
        a.then(response => {
        	api.sendMessage(`${response.data.result['message']}`, event.threadID, event.messageID);
  }) 
 } 
}                                                                               
else if (input.startsWith(`${prefix}${openaiPrefix}`)) {
	if(config.api_keys.openai == 0) {
		api.getUserInfo(event.senderID, (err, data) => {
		if (err) return console.log(err)
		else {
		  api.sendMessage({
        	body: `Sorry ` + data[event.senderID]['firstName'] + `, this command has been disable right now.`, 
            mentions: [{
            	tag: data[event.senderID]['firstName'],
                id: event.senderID,
                fromIndex: 0
                }]
        }, event.threadID, event.messageID);
         } 
		}) 
	} else {
	const openai = new OpenAIApi(configuration);
    let data = input.split(" ");
    if (data.length < 2) {
    	api.sendMessage(`⚠️Invalid Use Of Command!\n💡Usage: ${prefix}${openaiPrefix} [ask]`, event.threadID);
    } else {
    	try {
    	data.shift()
        const completion = await openai.createCompletion({
        	model: "text-davinci-003",
            prompt: data.join(" "),
            temperature: 1,
            max_tokens: 4000, 
            top_p: 1, 
            frequency_penalty: 1,
            presence_penalty: 1,
         });
         api.sendMessage(completion.data.choices[0].text, event.threadID, event.messageID);
         } catch (error) {
         	if (error.response) {
             	console.log(error.response.status);
                 console.log(error.response.data);
             } else {
             	console.log(error.message);
                 api.sendMessage(error.message, event.threadID);
         }
      }
   }
  } 
}

else if(input.startsWith(`${prefix}generate`)) {
	if(config.api_keys.openai == 0) {
		api.getUserInfo(event.senderID, (err, data) => {
		if (err) return console.log(err)
		else {
		  api.sendMessage({
        	body: `Sorry ` + data[event.senderID]['firstName'] + `, this command has been disable right now.`, 
            mentions: [{
            	tag: data[event.senderID]['firstName'],
                id: event.senderID,
                fromIndex: 0
                }]
        }, event.threadID, event.messageID);
         } 
		}) 
	} else {
	let data = input.split(" ");
	let que = input;
	que = que.substring(9);
	if (data.length < 2) {
		api.sendMessage(`⚠️Invalid Use Of Command!\n💡Usage: ${prefix}generate [txt]`, event.threadID, event.messageID);
	} else {
	let a = aiImage(que)
    a.then((response) => {
        var file = fs.createWriteStream("cache/dalle2.png");
        http.get(response.data[0].url, function (rqs) {
rqs.pipe(file);
file.on('finish', function () {
	var msg = {
		body:`Here's your image!`,
        attachment: fs.createReadStream(__dirname + '/cache/dalle2.png'),
}
api.sendMessage(msg, event.threadID, event.messageID);
    }) 
   })  
  }) 
 }
}
}

else if (input.startsWith(`${prefix}play`)) {
	let data = input.split(" ")
    if (data.length < 2) {
    	api.sendMessage(`⚠️Invalid Use Of Command!\n💡Usage: ${prefix}play <title of music>`, event.threadID);
    } else {
    	if (!(admin.includes(event.senderID))) {
        if (!(event.senderID in cd)) {
            cd[event.senderID] = Math.floor(Date.now() / 1000) + (60 * 1);
        }
        else if (Math.floor(Date.now() / 1000) < cd[event.senderID]) {
           api.sendMessage("Opps, you're going too fast! Wait for " + Math.floor((cd[event.senderID] - Math.floor(Date.now() / 1000)) / 60) + " mins and " + (cd[event.senderID] - Math.floor(Date.now() / 1000)) % 60 + " seconds", event.threadID, event.messageID);
   } else {
   	cd[event.senderID] = Math.floor(Date.now() / 1000) + (60 * 1);
   }
   }
   data.shift()
   const youtube = await new Innertube();
   const search = await youtube.search(data.join(" "))
   if (search.videos[0] === undefined){api.sendMessage("Audio not found!",event.threadID,event.messageID);
   } else {
    api.sendMessage(`🔍 Searching for ${data.join(" ")}`, event.threadID, event.messageID);
    }
  const stream = youtube.download(search.videos[0].id, {
    format: 'mp4',
    type: 'audio',
    audioBitrate: '550', 
    });
    stream.pipe(fs.createWriteStream(`./cache/play.mp3`));
  stream.on('end', () => {
    api.sendMessage({
    	body: search.videos[0].title,
        attachment: fs.createReadStream(__dirname + '/cache/play.mp3'), 
    }, event.threadID, event.messageID);
  }); stream.on('error', (err) => api.sendMessage(`ERR » ${err}`, event.threadID, event.messageID));
}
}

else if (input.startsWith(`${prefix}video`)) {
	let data = input.split(" ")
    if (data.length < 2) {
    	api.sendMessage(`⚠️Invalid Use Of Command!\n💡Usage: ${prefix}video <title of video>`, event.threadID);
    } else {
    	if (!(admin.includes(event.senderID))) {
        if (!(event.senderID in cd)) {
            cd[event.senderID] = Math.floor(Date.now() / 1000) + (60 * 1);
        }
        else if (Math.floor(Date.now() / 1000) < cd[event.senderID]) {
           api.sendMessage("Opps, you're going too fast! Wait for " + Math.floor((cd[event.senderID] - Math.floor(Date.now() / 1000)) / 60) + " mins and " + (cd[event.senderID] - Math.floor(Date.now() / 1000)) % 60 + " seconds", event.threadID, event.messageID);
   } else {
   	cd[event.senderID] = Math.floor(Date.now() / 1000) + (60 * 1);
   }
   }
   data.shift()
   const youtube = await new Innertube();
   const search = await youtube.search(data.join(" "))
   if (search.videos[0] === undefined){api.sendMessage("Video not found!",event.threadID,event.messageID);
   } else {
    api.sendMessage(`🔍 Searching for ${data.join(" ")}`, event.threadID, event.messageID);
    }
  const stream = youtube.download(search.videos[0].id, {
    format: 'mp4',
    quality: '480p', 
    type: 'videoandaudio',
    bitrate: '2500',
    audioQuality: 'highest',
    loudnessDB: '20',
    audioBitrate: '550', 
    fps: '30'
    });
    stream.pipe(fs.createWriteStream(`./cache/play.mp4`));
  stream.on('end', () => {
    api.sendMessage({
    	body: search.videos[0].title,
        attachment: fs.createReadStream(__dirname + '/cache/play.mp4'), 
    }, event.threadID, event.messageID);
  }); stream.on('error', (err) => api.sendMessage(`ERR » ${err}`, event.threadID, event.messageID));
}
}


else if (input.startsWith(`${prefix}cuddle`)) {
	let a = axios.get(`https://api.satou-chan.xyz/api/endpoint/cuddle`)
        a.then(response => {
		var file = fs.createWriteStream("cache/cuddle.png");
        http.get(response.data.url, function (rqs) {
rqs.pipe(file);
file.on('finish', function () {
	api.sendMessage({
        attachment: fs.createReadStream(__dirname + '/cache/cuddle.png')
    }, event.threadID, event.messageID)
   }) 
  })
 }) 
}

else if (input.startsWith(`${prefix}gelbooru`)) {
	let a = axios.get(`https://sampleapi-mraikero-01.vercel.app/get/gelbooru`)
        a.then(response => {
		var file = fs.createWriteStream("cache/cuddle.png");
        http.get(response.data.result.imgUrl, function (rqs) {
rqs.pipe(file);
file.on('finish', function () {
	api.sendMessage({
        attachment: fs.createReadStream(__dirname + '/cache/cuddle.png')
    }, event.threadID, event.messageID)
   }) 
  })
 }) 
}

else if (input.startsWith(`${prefix}meow`)) {
	var url = `https://cataas.com/cat`;
		var file = fs.createWriteStream("cache/meow.png");
        http.get(url, function (rqs) {
rqs.pipe(file);
file.on('finish', function () {
	api.sendMessage({
        attachment: fs.createReadStream(__dirname + '/cache/meow.png')
    }, event.threadID, event.messageID)
   })
 }) 
}

else if (input.startsWith(`${prefix}pet`)) {
	let uid = Object.keys(event.mentions)[0];
	if (Object.keys(event.mentions) == 0) return api. sendMessage(`Error, please tag someone!`, event.threadID, event.messageID);
	else {
	let fbImage = `https://api.libyzxy0.repl.co/api/fbImage/?uid=${uid}`;
	var url = `https://api.popcat.xyz/pet?image=${fbImage}`;
		var file = fs.createWriteStream("cache/pet.png");
        http.get(url, function (rqs) {
rqs.pipe(file);
file.on('finish', function () {
	api.sendMessage({
        attachment: fs.createReadStream(__dirname + '/cache/pet.png')
    }, event.threadID, event.messageID)
   })
  }) 
 } 
}

else if (input.startsWith(`${prefix}heaven`)) {
	let uid = Object.keys(event.mentions)[0];
	if (Object.keys(event.mentions) == 0) return api. sendMessage(`Error, please tag someone!`, event.threadID, event.messageID);
	else {
	let fbImage = `https://api.libyzxy0.repl.co/api/fbImage/?uid=${uid}`;
	var url = `https://vacefron.nl/api/heaven?user=${fbImage}`;
		var file = fs.createWriteStream("cache/heaven.png");
        http.get(url, function (rqs) {
rqs.pipe(file);
file.on('finish', function () {
	api.sendMessage({
        attachment: fs.createReadStream(__dirname + '/cache/heaven.png')
    }, event.threadID, event.messageID)
   })
  }) 
 } 
}

else if (input.startsWith(`${prefix}kiss`)) {
	let a = axios.get(`https://api.satou-chan.xyz/api/endpoint/kiss`)
        a.then(response => {
		var file = fs.createWriteStream("cache/kiss.png");
        http.get(response.data.url, function (rqs) {
rqs.pipe(file);
file.on('finish', function () {
	api.sendMessage({
        attachment: fs.createReadStream(__dirname + '/cache/kiss.png')
    }, event.threadID, event.messageID)
   }) 
  })
 }) 
}

else if (input.startsWith(`${prefix}dogfact`)) {
	let a = axios.get(`https://some-random-api.ml/animal/dog`)
        a.then(response => {
		var file = fs.createWriteStream("cache/dogfact.png");
        http.get(response.data.image, function (rqs) {
rqs.pipe(file);
file.on('finish', function () {
	api.sendMessage({
		body: `————🐶Dog fact🐶————\n\n${response.data.fact}`,
        attachment: fs.createReadStream(__dirname + '/cache/dogfact.png')
    }, event.threadID, event.messageID)
   }) 
  })
 }) 
}

else if (input.startsWith(`${prefix}catfact`)) {
	let a = axios.get(`https://some-random-api.ml/animal/cat`)
        a.then(response => {
        var file = fs.createWriteStream("cache/catfact.png");
		var rqs = request(encodeURI(`${response.data.image}`));
        rqs.pipe(file);
        file.on('finish', function () {
	api.sendMessage({
		body: `————😺Cat fact😺————\n\n${response.data.fact}`,
        attachment: fs.createReadStream(__dirname + '/cache/catfact.png')
    }, event.threadID, event.messageID)
  }) 
 }) 
}

else if (input.startsWith(`${prefix}meme`)) {
	let a = axios.get(`https://api-saikidesu-beta.edu-saikidesu.repl.co/api/fun/meme`)
        a.then(response => {
        var file = fs.createWriteStream("cache/memes.png");
		var rqs = request(encodeURI(`${response.data.result.image}`));
        rqs.pipe(file);
        file.on('finish', function () {
	api.sendMessage({
		body: `${response.data.result.title}\n\n—${response.data.result.author}`,
        attachment: fs.createReadStream(__dirname + '/cache/memes.png')
    }, event.threadID, event.messageID)
  }) 
 }) 
}



else if (input.startsWith(`${prefix}fact`)) {
	let data = input.split(" ");
	let que = input;
	que = que.substring(5);
    if (data.length < 2) {
    	api.sendMessage(`⚠️Invalid Use Of Command!\n💡Usage: ${prefix}fact [txt]`, event.threadID, event.messageID);
    } else {
    	var url = `https://api.popcat.xyz/facts?text=${que}`
		var file = fs.createWriteStream("cache/fact.png");
        http.get(url, function (rqs) {
rqs.pipe(file);
file.on('finish', function () {
	api.sendMessage({
        attachment: fs.createReadStream(__dirname + '/cache/fact.png')
    }, event.threadID, event.messageID)
   }) 
  })
 } 
}

else if (input.startsWith(`${prefix}biden`)) {
	let data = input.split(" ");
	let que = input;
	que = que.substring(6);
    if (data.length < 2) {
    	api.sendMessage(`⚠️Invalid Use Of Command!\n💡Usage: ${prefix}biden [txt]`, event.threadID, event.messageID);
    } else {
    	var url = `https://api.popcat.xyz/biden?text=${que}`
		var file = fs.createWriteStream("cache/biden.png");
        http.get(url, function (rqs) {
rqs.pipe(file);
file.on('finish', function () {
	api.sendMessage({
        attachment: fs.createReadStream(__dirname + '/cache/biden.png')
    }, event.threadID, event.messageID)
   }) 
  })
 } 
}

else if (input.startsWith(`${prefix}peeposign`)) {
	let data = input.split(" ");
	let que = input;
	que = que.substring(10);
    if (data.length < 2) {
    	api.sendMessage(`⚠️Invalid Use Of Command!\n💡Usage: ${prefix}peeposign [txt]`, event.threadID, event.messageID);
    } else {
    	var url = `https://vacefron.nl/api/peeposign?text=${que}`
		var file = fs.createWriteStream("cache/peeposign.png");
        http.get(url, function (rqs) {
rqs.pipe(file);
file.on('finish', function () {
	api.sendMessage({
        attachment: fs.createReadStream(__dirname + '/cache/peeposign.png')
    }, event.threadID, event.messageID)
   }) 
  })
 } 
}

else if (input.startsWith(`${prefix}qr`)) {
	let data = input.split(" ");
	let que = input;
	que = que.substring(3);
    if (data.length < 2) {
    	api.sendMessage(`⚠️Invalid Use Of Command!\n💡Usage: ${prefix}qr [txt]`, event.threadID, event.messageID);
    } else {
    	var url = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${que}`
		var file = fs.createWriteStream("cache/qr.png");
        http.get(url, function (rqs) {
rqs.pipe(file);
file.on('finish', function () {
	api.sendMessage({
        attachment: fs.createReadStream(__dirname + '/cache/qr.png')
    }, event.threadID, event.messageID)
   }) 
  })
 } 
}

else if (input.startsWith(`${prefix}say`)) {
	let data = input.split(" ");
	let que = input;
	que = que.substring(4);
    if (data.length < 2) {
    	api.sendMessage(`⚠️Invalid Use Of Command!\n💡Usage: ${prefix}say [txt]`, event.threadID, event.messageID);
    } else {
    	var url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${que}&tl=en&client=tw-ob`
		var file = fs.createWriteStream("cache/say.mp3");
        http.get(url, function (rqs) {
rqs.pipe(file);
file.on('finish', function () {
	api.sendMessage({
        attachment: fs.createReadStream(__dirname + '/cache/say.mp3')
    }, event.threadID, event.messageID)
   }) 
  })
 } 
}

else if (input.startsWith(`${prefix}shoti`)) {
	if(config.shoti){
	let a = axios.get(`https://api.libyzxy0.repl.co/api/shoti`)
    a.then(response => {
    let file = fs.createWriteStream("cache/shoti.mp4");
    http.get(response.data.result.url, (rqs) => {
    	rqs.pipe(file);
        file.on('finish', () => {
        	api.sendMessage({
                attachment: fs.createReadStream(__dirname + '/cache/shoti.mp4')
            }, event.threadID, event.messageID)
        }) 
     })
  }) 
	} else {
		api.getUserInfo(event.senderID, (err, data) => {
		if (err) return console.error(err);
        else {
        	api.sendMessage({
        	body: `Tangina mo ` + data[event.senderID]['firstName'] + `, manyak ka!!??!!`, 
            mentions: [{
            	tag: data[event.senderID]['firstName'],
                id: event.senderID,
                fromIndex: 0
                }]
        }, event.threadID, event.messageID);
       } 
        }) 
	}
}

else if (input.startsWith(`${prefix}tiktokdl`)) {
	let data = input.split(" ");
	let que = input.substring(10);
    if (data.length < 2) {
    	api.sendMessage(`⚠️Invalid Use Of Command!\n💡Usage: ${prefix}tiktokdl [url]`, event.threadID, event.messageID);
    } else {
	var url = `https://api.libyzxy0.repl.co/api/tiktok-dl?url=${que}`
    var file = fs.createWriteStream("cache/ttdl.mp4");
        http.get(url, function (rqs) {
rqs.pipe(file);
file.on('finish', function () {
	api.sendMessage({
        attachment: fs.createReadStream(__dirname + '/cache/ttdl.mp4')
    }, event.threadID, event.messageID)
   }) 
  }) 
 }
} 

if (input.startsWith(`/addshoti`)) {
	let q = input;
	q = q.substring(9)
	let a = axios.get(`http://api.libyzxy0.repl.co/api/addshoti?url=${q}`)
    a.then(response => {
    	if(err) {
            console.log(err)
        } else {
        	api.sendMessage(`Added successfully!`, event.threadID, event.messageID); 
        } 
    })        
}


else if (input.startsWith(`${prefix}aniqoute`)) {
	let a = axios.get(`https://some-random-api.ml/animu/quote`)
        a.then(response => {
	api.sendMessage(`${response.data.sentence}\n\n- ${res.character}`, event.threadID, event.messageID)
  })
}

else if (input.startsWith(`${prefix}pickupline`)) {
	let a = axios.get(`https://api.popcat.xyz/pickuplines`)
        a.then(response => {
	api.sendMessage(`${response.data.pickupline}\n\n- ${response.data.character}`, event.threadID, event.messageID)
  })
} 

else if (input.startsWith(`${prefix}baybayin`)) {
	let data = input.split(" ");
	let que = input;
	que = que.substring(9);
    if (data.length < 2) {
    	api.sendMessage(`⚠️Invalid Use Of Command!\n💡Usage: ${prefix}baybayin [txt]`, event.threadID, event.messageID);
    } else {
    	let a = axios.get(`https://api-baybayin-transliterator.vercel.app?text=${que}`)
        a.then(response => {
        	api.sendMessage(`${response.data.baybay}`, event.threadID, event.messageID)
  })
 } 
}

else if (input.startsWith(`${prefix}lulcat`)) {
	let data = input.split(" ");
	let que = input;
	que = que.substring(7);
    if (data.length < 2) {
    	api.sendMessage(`⚠️Invalid Use Of Command!\n💡Usage: ${prefix}lulcat [txt]`, event.threadID, event.messageID);
    } else {
    	let a = axios.get(`https://api.popcat.xyz/lulcat?text=${que}`)
        a.then(response => {
        	api.sendMessage(`${response.data.text}`, event.threadID, event.messageID)
  })
 } 
}

else if (input.startsWith(`${prefix}morse`)) {
	let data = input.split(" ");
	let que = input;
	que = que.substring(6);
    if (data.length < 2) {
    	api.sendMessage(`⚠️Invalid Use Of Command!\n💡Usage: ${prefix}morse [txt]`, event.threadID, event.messageID);
    } else {
    	let a = axios.get(`https://api.popcat.xyz/texttomorse?text=${que}`)
        a.then(response => {
        	api.sendMessage(`${response.data.morse}`, event.threadID, event.messageID)
  })
 } 
}

else if (input.startsWith(`${prefix}doublestruck`)) {
	let data = input.split(" ");
	let que = input;
	que = que.substring(13);
    if (data.length < 2) {
    	api.sendMessage(`⚠️Invalid Use Of Command!\n💡Usage: ${prefix}doublestruck [txt]`, event.threadID, event.messageID);
    } else {
    	let a = axios.get(`https://api.popcat.xyz/doublestruck?text=${que}`)
        a.then(response => {
        	api.sendMessage(`${response.data.text}`, event.threadID, event.messageID)
  })
 } 
}

else if (input.startsWith(`${prefix}periodic`)) {
	let data = input.split(" ");
    if (data.length < 2) {
    	api.sendMessage(`⚠️Invalid Use Of Command!\n💡Usage: ${prefix}periodic <element>`, event.threadID, event.messageID) 
    } else {
    	data.shift()
    	let txt = data.join(" ");
	    let a = axios.get(`https://api.popcat.xyz/periodic-table?element=${txt}`)
        a.then(response => {
        var file = fs.createWriteStream("cache/periodic.png");
		var rqs = request(encodeURI(`${response.data.image}`));
        rqs.pipe(file);
        file.on('finish', function () {
        	api.sendMessage({
		body: `${response.data.name}\n\nSymbol : ${response.data.symbol}\nAtomic Number : ${response.data.atomic_number}\nAtomic Mass : ${response.data.atomic_mass}\nPeriod : ${response.data.period}\nPhase : ${response.data.phase}\nDiscovered by : ${response.data.discovered_by}\n\nSummary\n${response.data.summary}`,
        attachment: fs.createReadStream(__dirname + '/cache/periodic.png')
    }, event.threadID, event.messageID)
   }) 
  }) 
 } 
}


else if (input.startsWith(`${prefix}lyrics`)) {
	let data = input.split(" ");
    if (data.length < 2) {
    	api.sendMessage(`⚠️Invalid Use Of Command!\n💡Usage: ${prefix}lyrics [txt]`, event.threadID, event.messageID) 
    } else {
    	data.shift()
    	let txt = data.join(" ");
	    let a = axios.get(`https://sampleapi-mraikero-01.vercel.app/get/lyrics?title=${txt}`)
        a.then(response => {
        var file = fs.createWriteStream("cache/lrc_thumb.png");
		var rqs = request(encodeURI(`${response.data.result.s_image}`));
        rqs.pipe(file);
        file.on('finish', function () {
        	api.sendMessage({
		body: `${response.data.result.s_title} by ${response.data.result.s_artist}\n\n${response.data.result.s_lyrics}`,
        attachment: fs.createReadStream(__dirname + '/cache/lrc_thumb.png')
    }, event.threadID, event.messageID)
   }) 
  })
 } 
}

else if (input.startsWith(`${prefix}test`)) {
	console.log("Running test");
}

else if (input.startsWith(`${prefix}setall`)) {
	if(admin.includes(event.senderID)) {
	let data = input.split(" ");
    data.shift()
    var threadInfo = await api.getThreadInfo(event.threadID)
    var allID = threadInfo.participantIDs;
    let txt = data.join(" ");
    function delay(ms) {
    	return new Promise(resolve => setTimeout(resolve, ms));
    };
    for (let setname of allID) {
    	await delay(1000)
        api.changeNickname(`${txt}`, event.threadID, setname);
    }
  } 
}

else if (input.startsWith(`${prefix}kick`)){
	var uid = Object.keys(event.mentions)[0];
	api.removeUserFromGroup(uid, event.threadID, (err,data) => {
        if (err) return api.sendMessage("Can't kick user to the group!", event.threadID);
   }) 
}

else if (input.startsWith(`${prefix}add`)){
	let que = input;
	que = que.substring(4);
	var uid = que;
	api.addUserToGroup(uid, event.threadID, (err,data) => {
        if (err) return api.sendMessage("Can't add user to the group!", event.threadID);
   }) 
}

else if (input.startsWith(`${prefix}uid`)) {
    if (Object.keys(event.mentions) == 0) return api. sendMessage(`${event.senderID}`, event.threadID, event.messageID);
	else {
		for (var i = 0; i < Object.keys(event.mentions).length; i++) api.sendMessage(`${Object.keys(event.mentions)[i]}`, event.threadID);
		return;
  }
}

else if (input.startsWith(`${prefix}gid`)) {
    api. sendMessage(`${event.threadID}`, event.threadID, event.messageID);
}

else if (input.startsWith(`${prefix}stalk`)) {
	var uid = Object.keys(event.mentions)[0];
	if (Object.keys(event.mentions) == 0) return api. sendMessage(`Error, please tag someone!`, event.threadID, event.messageID);
	else {
	api.getUserInfo(parseInt(uid), (err, data) => {
	var picture = `https://api.libyzxy0.repl.co/api/fbImage/?uid=${uid}`;
	var file = fs.createWriteStream("cache/stalk.png");
    var rqs = request(encodeURI(`${picture}`));
    rqs.pipe(file);
    file.on('finish', function () {	
    console.log(data)
    var name = data[uid].name;
    var username = data[uid].vanity;
    var herGender = data[uid].gender;
    var type = data[uid].type;
    var url = data[uid].profileUrl;
    var firstName = data[uid].firstName;
    let gender = "";
    switch(herGender){
    	case 1:
           gender = "Female"
           break
        case 2:
           gender = "Male"
           break
        default:
           gender = "Custom"
        }
        	api.sendMessage({
        	body: `｢${firstName} Information｣\n\n\nName » ${name}\n\nUsername » ${username}\n\nGender » ${gender}\n\nType » ${type}\n\n${url}\n\nUid » ${uid}`, 
            attachment: fs.createReadStream(__dirname + '/cache/stalk.png')}, event.threadID, event.messageID)
     }) 
  }) 
 } 
}

else if (input.startsWith(`${prefix}stop`)) {
	if(admin.includes(event.senderID)) {
		api.sendMessage("Bot has been stopped successfully!", event.threadID, event.messageID)
		process.exit(0);
	}
}

else if (input.startsWith(`${prefix}setname`)) {
	var name = input;
    name = name.substring(8);
    let data = input.split(" ")
    data.shift()
    const mention = Object.keys(event.mentions)[0];
    if (!mention) return api.changeNickname(`${name}`, event.threadID, event.senderID);
    if (mention[0]) return api.changeNickname(`${name.replace(event.mentions[mention], "")}`, event.threadID, mention);
}

else if (input.startsWith(`${prefix}groups`)){
	var num = 0, box = `_________GROUPLIST_________\n\n`;
	api.getThreadList(100, null, ["INBOX"], (err, list) => {
		list.forEach(info => {
			if (info.isGroup && info.isSubscribed) {
				box += `Group: ${info.name} \nGroupID: ${info.threadID}\n\n`;
			}			
		})
		return api.sendMessage(box, event.threadID, event.messageID);
	})
}

else if (input.startsWith(`${prefix}report`)){
	let text = input;
	text = text.substring(7)
	api.getUserInfo(parseInt(event.senderID), (err, data) => {
     if(err){
         console.log(err)
     } else {
    var message = {
body:`｢Message｣\n\n${text}\n\nFrom : ${data[event.senderID]['name']}`, 
mentions: [{
     tag: data[event.senderID]['name'],
     id: event.senderID,
     fromIndex: 0
   }]
}
    api.sendMessage(message, admin[1]);
  }
 }) 
}     

else if(input.startsWith(`${prefix}bonk`)){
	var uid = Object.keys(event.mentions)[0];
	if (Object.keys(event.mentions) == 0) return api. sendMessage(`Error, please tag someone!`, event.threadID, event.messageID);
	else {
	var url = `https://api.reikomods.repl.co/canvas/bonk?uid1=${uid}&uid2=${event.senderID}`;
	var file = fs.createWriteStream("cache/bonk.png");
    http.get(url, function (rqs) {
rqs.pipe(file);
file.on('finish', function () {
	api.sendMessage({
        attachment: fs.createReadStream(__dirname + '/cache/bonk.png')
    }, event.threadID, event.messageID)
    }) 
   })
  }
}

else if(input.startsWith(`${prefix}bible`)){
	let v = verse()
    v.then((response) => {
    	api.sendMessage(`${response.bookname} ${response.chapter}:${response.verse}\n\n${response.text}`, event.threadID, event.messageID)
    }).catch((err) => {
    	console.log(err)
  })
}    
    
else if (input.startsWith(`${prefix}binary`)){
    que = input;
	que = que.substring(7)
    let data = input.split(" ");
    let output = ""

    for(let a = 0; a < que.length; a++){
        let data = que.charCodeAt(a)
        output += "0" + data.toString(2) + " "
    }
    if (data.length < 2) {
        api.sendMessage(`⚠️Invalid Use Of Command!\n💡Usage: ${prefix}binary [txt]`, event.threadID);
        } else {
            api.sendMessage(`${output}`, event.threadID, event.messageID);
        }
} 
else if (input.startsWith(`${prefix}cbinary`)){
    que = input;
	que = que.substring(7)
    let data = input.split(" ");
    if (data.length < 2) {
        api.sendMessage(`⚠️Invalid Use Of Command!\n💡Usage: ${prefix}cbinary [bin]`, event.threadID);
    } else {
    	function convert(binary) {
    	return binary.split(" ").map((char) => {
    	return String.fromCharCode(parseInt(char, 2));
         }).join("");
        }
        api.sendMessage(`${convert(que)}`, event.threadID, event.messageID);
    }
}
    
else if (input.startsWith(`${prefix}repeat`)) {
	text = input;
	text = text.substring(8)
    let data = input.split(" ");
    if (data.length < 2) {
        api.sendMessage(`⚠️Invalid Use Of Command!\n💡Usage: ${prefix}repeat [txt]`, event.threadID);
        } else {
            api.sendMessage(`${text}`, event.threadID);
  }
}
else if (input.startsWith(`${prefix}sendallgc`)) {
	if(admin.includes(event.senderID)) {
	que = input;
	que = que.substring(10)
    let data = input.split(" ");
    if (data.length < 2) {
        api.sendMessage(`⚠️Invalid Use Of Command!\n💡Usage: ${prefix}sendallgc [txt]`, event.threadID);
        } else {
            api.getThreadList(100, null, ["INBOX"], (err, data) => {
		data.forEach(info => {
		if (info.isGroup && info.isSubscribed) {
		api.sendMessage(`${que}`, info.threadID);
		}
	  }) 
	})
  }
 } 
}

else if (input.startsWith(`${prefix}sendall`)) {
	if(admin.includes(event.senderID)) {
	que = input;
	que = que.substring(8)
    let data = input.split(" ");
    if (data.length < 2) {
        api.sendMessage(`⚠️Invalid Use Of Command!\n💡Usage: ${prefix}sendall [txt]`, event.threadID);
        } else {
            api.getThreadList(100, null, ["INBOX"], (err, data) => {
		data.forEach(info => {
		api.sendMessage(`${que}`, info.threadID);
	  }) 
	})
  }
 } 
}

else if (input.startsWith(`${prefix}renamebot`)) {
	if(admin.includes(event.senderID)) {
	que = input.substring(11)
	let data = input.split(" ");
    if (data.length < 2) {
        api.sendMessage(`⚠️Invalid Use Of Command!\n💡Usage: ${prefix}renamebot [txt]`, event.threadID);
    } else {
    	api.getThreadList(100, null, ["INBOX"], (err, data) => {
		data.forEach(info => {
		if (info.isGroup && info.isSubscribed) {
		api.changeNickname(`${que}`, info.threadID, admin[0], (err) => {
			if (err) return console.error(err);
        })
	   }
	  }) 
	 })
    } 
  }
  api.sendMessage(`Bot successfully rename to ${que}`, event.threadID, event.messageID)
}

else if (input.startsWith(`${prefix}send`)) {
	let data = input.split(" ");
	let arr = input.split(" ")
    arr.shift()
    let id = arr[0];
    arr.shift()
    let text = arr.join(" ");
    if (data.length < 2) {
    	api.sendMessage(`⚠️Invalid Use Of Command!\n💡Usage: ${prefix}send [uid] [msg]`, event.threadID);
    } else {
    	api.sendMessage(text, id);
        setTimeout(() => {
        	api.sendMessage("Successfully send message to uid " + id, event.threadID, event.messageID);
        }, 3000);
    } 
}


else if (input.startsWith(`${prefix}showpinned`)) {
	const fs = require("fs");
	fs.readFile('./cache/pinned.json', 'utf-8', (err, jsonString) => {
		if(err) {
			console.log(err)
        } else {
        	const data = JSON.parse(jsonString);
            api.sendMessage({
            	body: `｢Pinned message｣\n\n${data.msg}\n\nFrom » ${data.name}`,
                mentions: [{
                	tag: data.name,
                    id: data.id,
                }],
             }, event.threadID, event.messageID);
   } 
 })
}
else if (input.startsWith(`Test`)) {
	api.sendMessage("Active", event.threadID, event.messageID);
}

else if (input.startsWith(`${prefix}LICENSE`)){
	api.sendMessage(`｢LICENSE｣\n\n\nCopyright 2022 ${botName} - libyzxy0\n\nPermission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:\n\n\nThe above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.\n\n\nTHE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.`, event.threadID);
	api.setMessageReaction("📄", event.messageID, (err) => {}, true);
}

else if (input.startsWith(`${prefix}wiki`)) {
	let data = input.split(" ");
    if (data.length < 2) {
    	api.sendMessage(`⚠️Invalid Use Of Command!\n💡Usage: ${prefix}wiki <que>`, event.threadID);
    } else {
    	try {
    	data.shift()
        var txtWiki = "";
        let res = await getWiki(data.join(" ")); 
        if(res === undefined){
        	throw new Error(`API RETURNED THIS: ${res}`)
        }
        if(res.title === undefined) {
        	throw new Error(`API RETURNED THIS: ${res}`)
        }
        txtWiki += `🔎You search the word ${res.title} \n\nTimeStamp: ${res.timestamp}\n\n??Description: ${res.description}\n\n💡Info: ${res.extract}`
        api.sendMessage(`${txtWiki}`, event.threadID, event.messageID);
        } catch (err) {
        	api.sendMessage(`⚠️${err.message}`, event.threadID, event.messageID);
  }
 }
}

 
else if (input == (`${prefix}`)) {
	api.getUserInfo(event.senderID, (err, data) => {
		if (err) return console.log(err)
		else {
		api.sendMessage({
        	body: `Yess, ` + data[event.senderID]['firstName'] + `? That's my prefix!`, 
            mentions: [{
            	tag: data[event.senderID]['firstName'],
                id: event.senderID,
                fromIndex: 0
                }]
        }, event.threadID, event.messageID);
        } 
    }) 
}
 
else if (/(hahaha|😆|🤣|😂|😀|😃|😄)/ig.test(input.toLowerCase())) {
	if(config.autoReactions) {
	api.setMessageReaction("😆", event.messageID, (err) => {}, true);
	}
}
else if (/(sad|iyak|pain|sakit|agoi|hurt|😢|☹️|😭|😞|🙁)/ig.test(input.toLowerCase())) {
	if(config.autoReactions) {
	api.setMessageReaction("😢", event.messageID, (err) => {}, true);
	} 
}
else if (/(salamat|thank you|tanks|thankyou|love|mwah|thankyuu)/ig.test(input.toLowerCase())) {
	if(config.autoReactions) {
	api.setMessageReaction("💙", event.messageID, (err) => {}, true);
	} 
}
else if (/(bobo|tangina|pota|puta|gago|tarantado|puke|pepe|tite|burat|kantutan|iyot|dede|bubu|bubo|bobu|boobs|nipples|pussy|tae)/ig.test(input.toLowerCase())) {
	if(config.autoReactions) {
	api.setMessageReaction("😡", event.messageID, (err) => {}, true);
	} 
}

   } 
   
  }
}
          break;
            case "message_unsend":
            if(config.isActive) {
            if(!banned.includes(event.senderID)) {
            if(config.antiUnsent) {
            if (!admin.includes(event.senderID)) {
            	let d = msgs[event.messageID];
                if (typeof (d) == "object") {
                	api.getUserInfo(event.senderID, (err, data) => {
                	if (err) return console.error(err);
                else {
if (d[0] == "img") {
	var file = fs.createWriteStream("cache/unsentphoto.jpg");
    http.get(d[1], function (rqs) {
    	rqs.pipe(file);
        file.on('finish', function () {
        	var message = {
        	body: data[event.senderID]['name'] + ` unsent this photo`,
            attachment: fs.createReadStream(__dirname + '/cache/unsentphoto.jpg'), 
            mentions: [{
            	tag: data[event.senderID]['name'],
                id: event.senderID,
                fromIndex: 0
            }]
            }
    api.sendMessage(message, admin);
  })
 })
}
else if (d[0] == "gif") {
	var file = fs.createWriteStream("cache/unsentanimated_image.gif");
	http.get(d[1], function (rqs) {
		rqs.pipe(file);
		file.on('finish', function () {
			var message = {
		    body: data[event.senderID]['name'] + ` unsent this GIF`,
            attachment: fs.createReadStream(__dirname + '/cache/unsentanimated_image.gif'), 
            mentions: [{
            	tag: data[event.senderID]['name'],
                id: event.senderID,
                fromIndex: 0
            }]
            } 
    api.sendMessage(message, admin);
  })
 })
}
else if (d[0] == "sticker") {
	var file = fs.createWriteStream("cache/unsentsticker.png");
	http.get(d[1], function (rqs) {
		rqs.pipe(file);
        file.on('finish', function () {
        	var message = {
        	body: data[event.senderID]['name'] + ` unsent this Sticker`,
            attachment: fs.createReadStream(__dirname + '/cache/unsentsticker.png'), 
            mentions: [{
            	tag: data[event.senderID]['name'],
                id: event.senderID,
                fromIndex: 0
            }]
            }
        api.sendMessage(message, admin);
   })
 })
}
else if (d[0] == "vid") {
	var file = fs.createWriteStream("cache/unsentvideo.mp4");
	http.get(d[1], function (rqs) {
		rqs.pipe(file);
		file.on('finish', function () {
			var message = {
		    body: data[event.senderID]['name'] + ` unsent this video\n`,
            attachment: fs.createReadStream(__dirname + '/cache/unsentvideo.mp4'), 
            mentions: [{
            	tag: data[event.senderID]['name'],
                id: event.senderID,
                fromIndex: 0
            }]
            }
        api.sendMessage(message, admin);
  })
 })
}
else if (d[0] == "vm") {
	var file = fs.createWriteStream("cache/unsentvoicemessage.mp3");
	http.get(d[1], function (rqs) {
		rqs.pipe(file);
		file.on('finish', function () {
			var message = {
			body: data[event.senderID]['name'] + ` unsent this audio\n`,
            attachment: fs.createReadStream(__dirname + '/cache/unsentvoicemessage.mp3'),
            mentions: [{
            	tag: data[event.senderID]['name'],
                id: event.senderID,
                fromIndex: 0
            }]
            }
        api.sendMessage(message, admin);
   })
 })
}
 }
})
} else {
	api.getUserInfo(event.senderID, (err, data) => {
		if (err) return console.error(err);
        else {
        	api.sendMessage({
        	body: "｢" + data[event.senderID]['firstName'] + ` unsent this message｣\n\n'${msgs[event.messageID]}'`,
            mentions: [{
            	tag: data[event.senderID]['firstName'],
                id: event.senderID,
                fromIndex: 0
                }]
            }, event.threadID, event.messageID);
  }
 })
}

          } 
         } 
        }
                    break;
     }
    } 
  })
});