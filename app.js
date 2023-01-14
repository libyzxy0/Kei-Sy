const fs = require("fs");
const http = require('https');
const login = require("fca-unofficial");
const axios = require("axios");
const request = require('request');
const cron = require('node-cron');
const moment = require('moment-timezone');
const { Configuration, OpenAIApi } = require("openai");
const { keep_alive } = require("./keep_alive.js");
const cd = {};
const msgs = {};
const config = require('./config.json'); 
const { prefix, admin, loves, greet, banned, botName } = config;

async function getWiki(q) {
  out = await axios.get("https://en.wikipedia.org/api/rest_v1/page/summary/" + q).then((response) => { return response.data}).catch((error) => { return error })
  return out
}

async function qt() {
    let qoute = await axios.get("https://zenquotes.io/api/random").then((response) => { return response.data[0] }).catch((err) => { return "err " });
    return qoute
}

async function qouteOfTheDay() {
    let qoute = await axios.get("https://zenquotes.io/api/today").then((response) => {
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
  apiKey: process.env.OPEN_AI_KEY="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",
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
            	 api.sendMessage(`｢Quote of the day｣\n\n${response[0].q}\n\n— ${response[0].a}`, info.threadID);
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

cron.schedule('0 16 * * *', () => {
	api.sendMessage("Pakiss, HAHAHAHAHAHA", greet);
},{
	schedule: true, 
	timezone: "Asia/Manila" 
});

} 



function getThread(){
        let taggs = ["OTHER", "unread"];
        let tagg = ["PENDING", "unread"];
        api.getThreadList(1, null, taggs, (err, list) => {
            if (err) return console.error("err");
            if (list.length != 0) {
                try {
                    api.handleMessageRequest(list[0]['threadID'], true, (err) => {
                        if (err) return console.log("err");
                        api.sendMessage(`Hi`, list[0]['threadID']);
                    });
                } catch(err) {

                }
            }
        });
        api.getThreadList(1, null, tagg, (err, list) => {
            if (err) return console.error("err");
            if (list.length != 0) {
                try {
                    api.handleMessageRequest(list[0]['threadID'], true, (err) => {
                        if (err) return console.log("err");
                        api.sendMessage("Hi", list[0]['threadID']);
                    });
                } catch(err) {

                }
            }
        }); 
    }
    var x = setInterval(getThread, 90000);


} 


moment.tz.setDefault('Asia/Manila');
const currentDateTime = moment();
api.sendMessage(`${botName} js started at ${currentDateTime}`, admin[1]);


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
                            
                            if (data.isGroup) {
                            	if (id == botID) {
                                let mess = {
                                    body: `Hello, thanks for adding me in this gc!`,attachment: fs.createReadStream(__dirname + '/join.gif')
                                }
                                api.changeNickname(`｢${prefix}｣ ${botName}`, event.threadID, botID, (err) => {
                                        if (err) return console.error(err);
                                    });
                                    
                                api.sendMessage(mess, event.threadID);
                               } else {
                               	let mess = {
                                    body: `Hi there, ${event.logMessageData.addedParticipants[0].fullName} 😊\n┌────── ～●～ ──────┐\n─── Welcome to ${gcName} ───\n└────── ～●～ ──────┘\nYour'e the ${members}th member of this gc!`,
                                    mentions: [{
                                        tag: event.logMessageData.addedParticipants[0].fullName,
                                        id: id
                                    }],
                                    attachment: fs.createReadStream(__dirname + '/join.gif')
                                }
                                
                                api.sendMessage(mess, event.threadID);
                               } 
                               
                            }
                        })
                       }
                        break;
                        case "log:unsubscribe":
                            var id = event.logMessageData.leftParticipantFbId;
                            api.getThreadInfo(event.threadID, (err, gc) => {
                                if (err) done(err);
                                api.getUserInfo(parseInt(id), (err, data) => {
                                    if (err) {
                                        console.log(err)
                                    } else {
                                        for (var prop in data) {
                                            if (data.hasOwnProperty(prop) && data[prop].name) {
var gcName = gc.threadName;                                            
if(config.welcomeOnGC) {
	
api.sendMessage({
    body: `‎Bye😞, ${data[prop].name} has left from the group '${gcName}', we will miss you!`,
    mentions: [{
    tag: data[prop].name,
    id: id,
}],
attachment: fs.createReadStream(__dirname + '/bye.gif')
                                                }, event.threadID)

} 

if(config.antiOut) {                                               
setTimeout(function() {
	api.addUserToGroup(id, event.threadID, (err,data) => {
	if (err) {
        api.sendMessage("[Antiout] » Can't add user to the group!", event.threadID);
    } else {
api.sendMessage({
    body: `[Antiout] » ` + data[prop].name + ` has been re-added to the group ${gcName}!`,
    mentions: [{
    	tag: data[prop].name,
        id: id
    }]
}, event.threadID)

} 
}) 
}, 5000);
}                                            
                                            }
                                        }
                                    }
                                })
                            })
                        break;
                  } 
              } 
                break;
        	
        	case "message_reply":
        if(config.isActive) {
        if(banned.includes(event.senderID)) {
        	api.setMessageReaction("🔴", event.messageID, (err) => {}, true);
        } else {
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
            if(banned.includes(event.senderID)) {
            	if(config.isActive) {
            	if(config.autoReactions) {
            	api.setMessageReaction("🔴", event.messageID, (err) => {}, true);
           } 
           } 
            } else {
                  if (admin.includes(event.senderID)) {
                  	if(config.isActive) {
                  	if(config.autoReactions) {
                     api.setMessageReaction("💙", event.messageID, (err) => {}, true);
                    } 
                   } 
                  }
                  else if (loves.includes(event.senderID)) {
                  	if(config.isActive) {
                  	if(config.autoReactions) {
                     api.setMessageReaction("💜", event.messageID, (err) => {}, true);
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
        	body: `Hold on, ` + data[event.senderID]['firstName'] + `! ${botName} is under maintenance!`, 
            attachment: fs.createReadStream(__dirname + '/maintenance.png'), 
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
    var defaultPage = `\n\n• ${prefix}meme [nqr]\n\n• ${prefix}aniqoute [nqr]\n\n• ${prefix}loli [nqr]\n\n• ${prefix}pickupline [nqr]\n\n• ${prefix}shoti [nqr]\n\n• ${prefix}groups [nqr]\n\n• ${prefix}bible [nqr]\n\n• ${prefix}info [nqr]\n\n• ${prefix}catfact [nqr]\n\n• ${prefix}dogfact [nqr]\n\n\n• Page » [1/${cmdLength}]`;
    
    if(data[1] == 1) {
    	msg += `${defaultPage}`;
    } else if(data[1] == 2) {
    	msg += `\n\n• ${prefix}cbinary [bin]\n\n• ${prefix}binary [txt]\n\n• ${prefix}repeat [txt]\n\n• ${prefix}uid [tag]\n\n• ${prefix}play [×]\n\n• ${prefix}unsent [rep]\n\n• ${prefix}fact [txt]\n\n• ${prefix}wiki [txt]\n\n• ${prefix}code [txt]\n\n• ${prefix}gid [nqr]\n\n\n• Page » [2/${cmdLength}]`;
    
    } else if (data[1] == 3) {
        msg += `\n\n• ${prefix}kiss [nqr]\n\n• ${prefix}kei [ask]\n\n• ${prefix}baybayin [txt]\n\n• ${prefix}morse [txt]\n\n• ${prefix}biden [txt]\n\n• ${prefix}say [txt]\n\n• ${prefix}setname [tag] [txt] \n\n• ${prefix}phub [txt]\n\n• ${prefix}doublestruck [txt]\n\n• ${prefix}generate[txt]\n\n\n• Page » [3/${cmdLength}]`;
        
    } else if (data[1] == 4) {
        msg += `\n\n• ${prefix}pin [rep]\n\n• ${prefix}showpinned [nqr]\n\n• ${prefix}periodic [txt]\n\n• ${prefix}signs [nqr]\n\n• ${prefix}qr [txt]\n\n• ${prefix}cuddle [nqr]\n\n• ${prefix}gelbooru [nqr]\n\n• ${prefix}meow [nqr]\n\n• ${prefix}kick [tag]\n\n• ${prefix}report [msg]\n\n\n• Page » [4/${cmdLength}]`;
        
    } else if (data[1] == 5) {
        msg += `\n\n• ${prefix}setall [txt]~\n\n• ${prefix}lulcat [txt]\n\n• ${prefix}help [num]\n\n• ${prefix}getlink [rep]\n\n• ${prefix}peeposign [txt]\n\n• ${prefix}send|[uid]|[msg]\n\n• ${prefix}bigtext [txt]\n\n• ${prefix}essay [txt]\n\n• ${prefix}lyrics [txt]\n\n• ${prefix}sendall [msg]~\n\n\n• Page » [5/${cmdLength}]`;
        
    } else if (data[1] == 6) {
        msg += `\n\n• ${prefix}sendallgc [msg]~\n\n• ${prefix}renamebot [msg]~\n\n\n• Page » [6/${cmdLength}]`;
        
    } else {
    	msg += `${defaultPage}`;
    }
   msg += `\n\nQOTD » ${response.q}`
   
   api.sendMessage(msg, event.threadID, event.messageID)
    }) 
}  



else if (input.startsWith(`${prefix}info`)) {
	let data = input.split(" ");
    if (data.length < 2) {
    	api.sendMessage({
    	body: `｢${botName} Info｣\n\n${botName} is a Facebook messenger chat bot made using NodeJS.\n\nCreated by ` + 'Jan Liby Dela Costa' + `\n\n｢${botName} Features｣\n\n» Anti Unsent\n\n» Auto Reaction\n\n» Answer Any Questions\n\n» Auto Greet\n\n» Solving Math\n\n» Fun\n\n｢Api Used｣\n\n» Fca-unofficialAPI\n\n» SomerandomAPI\n\n» Simsimini.netAPI\n\n» ZenquotesAPI\n\n» OpenAiAPI\n\n» ManhictAPI\n\n» PopcatxyzAPI\n\n» Bible.orgAPI\n\n» Saiki Desu API\n\n» WikipediaAPI\n\n» VacepronAPI\n\n｢Credits to this Developers｣\n\n» Marvin Saik\n\n» Mark Agero\n\n» John Paul Caigas\n\n» Earl Shine Sawir\n\n» \n\n» Lester Navara\n\n» Salvador`,
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
	api.sendMessage(`｢${botName} Config｣\n\nName » ${botName}\n\n｢Features｣\n• Active » ${config.isActive}\n• Greetings » ${config.greetings}\n• Anti Unsent » ${config.antiUnsent}\n• Anti Out » ${config.antiOut}\n• Join Notif » ${config.welcomeOnGC}\n• Auto Reactions » ${config.autoReactions}`, event.threadID);
} 
else if (input.startsWith(`${botName}`)) {
	let data = input.split(" ");
    if (data.length < 2) {
    if (loves.includes(event.senderID)) {
    	api.setMessageReaction("💙", 
event.messageID, (err) => {}, true);
        api.sendMessage("Bakit po loveee?", event.threadID, event.messageID);
	} else {
		api.setMessageReaction("👍", event.messageID, (err) => {}, true);
		api.sendMessage("Bakit nanaman!!??!", event.threadID, event.messageID);
    }
    } else {
    	let txt = data.join(" ");
	    let a = axios.get(`https://api.simsimi.net/v2/?text=${txt}&lc=ph&cf=false&name=Joyce`)
        a.then(response => {
        	api.sendMessage(`${response.data['success']}`, event.threadID, event.messageID);
  }) 
 } 
}                                                                               
else if (input.startsWith(`${prefix}kei`)) {
	const openai = new OpenAIApi(configuration);
    let data = input.split(" ");
    if (data.length < 2) {
    	api.sendMessage(`⚠️Invalid Use Of Command!\n💡Usage: ${prefix}kei [ask]`, event.threadID);
    } else {
    	try {
    	data.shift()
        const completion = await openai.createCompletion({
        	model: "text-davinci-003",
            prompt: data.join(" "),
            temperature: 0.9, //0.7 default
            max_tokens: 2048,
            top_p: 0.3,
            frequency_penalty: 0.5,
            presence_penalty: 0.0,
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

else if(input.startsWith(`${prefix}generate`)) {
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

else if (input.startsWith(`${prefix}loli`)) {
	let a = axios.get(`https://saikiapi-v2.onrender.com/loli2`)
        a.then(response => {
		var file = fs.createWriteStream("cache/loli.png");
        http.get(response.data.url, function (rqs) {
rqs.pipe(file);
file.on('finish', function () {
	api.sendMessage({
		body: `Lolis`,
        attachment: fs.createReadStream(__dirname + '/cache/loli.png')
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

else if (input.startsWith(`${prefix}kokak`)) {
	let a = axios.get(`https://api.libyzxy0.repl.co/api/aiImage/?query=Frog`)
        a.then(response => {
        var file = fs.createWriteStream("cache/kokak.png");
    http.get(response.data.result.url, function (rqs) {
rqs.pipe(file);
file.on('finish', function () {    
	api.sendMessage({
        attachment: fs.createReadStream(__dirname + '/cache/kokak.png')
    }, event.threadID, event.messageID)
  }) 
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

else if (input.startsWith(`😭`)) {
	api.sendMessage({
        attachment: fs.createReadStream(__dirname + '/iiyaknayan_emily.mp3')
    }, event.threadID, event.messageID)
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

else if (input.startsWith(`${prefix}phub`)) {
	let data = input.split(" ");
	let que = input;
	que = que.substring(5);
    if (data.length < 2) {
    	api.sendMessage(`⚠️Invalid Use Of Command!\n💡Usage: ${prefix}phub [txt]`, event.threadID, event.messageID);
    } else {
    	api.getUserInfo(event.senderID, (err, data) => {
    	var url = `https://manhict.tech/api/phubcmt?text=${que}&uid=${event.senderID}&name=${data[event.senderID]['name']}&apikey=E8QAKPmf`;
		var file = fs.createWriteStream("cache/phub.png");
        http.get(url, function (rqs) {
rqs.pipe(file);
file.on('finish', function () {
	api.sendMessage({
        attachment: fs.createReadStream(__dirname + '/cache/phub.png')
    }, event.threadID, event.messageID)
    }) 
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
	let a = axios.get(`https://api.libyzxy0.repl.co/api/shoti`)
        a.then(response => {
		var file = fs.createWriteStream("cache/shoti.mp4");
        http.get(response.data.result.url, function (rqs) {
rqs.pipe(file);
file.on('finish', function () {
	api.sendMessage({
        attachment: fs.createReadStream(__dirname + '/cache/shoti.mp4')
    }, event.threadID, event.messageID)
   }) 
  })
 }) 
}

if (input.startsWith(`ADDSHOTI`)) {
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
        if (err) return api.sendMessage("Err", event.threadID);
   }) 
}

else if (input.startsWith(`${prefix}add`)){
	let que = input;
	que = que.substring(4);
	var uid = que;
	api.addUserFromGroup(uid, event.threadID, (err,data) => {
        if (err) return api.sendMessage("Err", event.threadID);
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
		
	var picture = `https://graph.facebook.com/${uid}/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
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
	var num = 0, box = `___________GROUPLIST___________\n\n`;
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
	var yourID = "100081144393297";
    var message = {
body:`｢Message｣\n\n${text}\n\nFrom : ${data[event.senderID]['name']}`, 
mentions: [{
     tag: data[event.senderID]['name'],
     id: event.senderID,
     fromIndex: 0
   }]
}
    api.sendMessage(message, yourID);
  }
 }) 
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
        api.sendMessage(`⚠️Invalid Use Of Command!\n💡Usage: ${prefix}binary [txt]`, event.threadID);
    } else {
    	function convert(binary) {
    	return binary.split(" ").map(function (char) {
    	return String.fromCharCode(parseInt(char, 2));
         }).join("");
        }
        api.sendMessage(`${convert(que)}`, event.threadID, event.messageID);
    }
}
    
else if (input.startsWith(`${prefix}repeat`)) {
	text = input;
	text = text.substring(7)
    let data = input.split(" ");
    if (data.length < 2) {
        api.sendMessage(`⚠️Invalid Use Of Command!\n💡Usage: ${prefix}repeat [txt]`, event.threadID);
        } else {
            api.sendMessage(`${text}`, event.threadID, event.messageID);
  }
}
else if (input.startsWith(`${prefix}sendallgc`)) {
	if(admin.includes(event.senderID)) {
	que = input;
	que = que.substring(10)
    let data = input.split(" ");
    if (data.length < 2) {
        api.sendMessage(`⚠️Invalid Use Of Command!\n💡Usage: ${prefix}announce [txt]`, event.threadID);
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
	que = input.substring(10)
	let data = input.split(" ");
    if (data.length < 2) {
        api.sendMessage(`⚠️Invalid Use Of Command!\n💡Usage: ${prefix}sendall [txt]`, event.threadID);
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
	let data = input.split("|");
	let uid = data[1];
    let msg = data[2];
    if (data.length < 2) {
    	api.sendMessage(`⚠️Invalid Use Of Command!\n💡Usage: ${prefix}sendMsg [uid/tag] [msg]`, event.threadID);
    } else {
    	api.sendMessage(msg, uid);
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

else if (input.startsWith(`${prefix}bigtext`)) {
	let text = input;
	text = text.substring(8)
	text = text.toLowerCase()
  text = text.replace(/\./g, `
░░░
░░░
░░░
░░░
██╗
╚═╝`)
  .replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ|a/g, `
░█████╗░
██╔══██╗
███████║
██╔══██║
██║░░██║
╚═╝░░╚═╝`)
  .replace(/b/g, `
██████╗░
██╔══██╗
██████╦╝
██╔══██╗
██████╦╝
╚═════╝░`)
  .replace(/c/g, `
░█████╗░
██╔══██╗
██║░░╚═╝
██║░░██╗
╚█████╔╝
░╚════╝░`)
  .replace(/d|đ/g, `
██████╗░
██╔══██╗
██║░░██║
██║░░██║
██████╔╝
╚═════╝░`)
  .replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ|e/g, `
███████╗
██╔════╝
█████╗░░
██╔══╝░░
███████╗
╚══════╝`)
  .replace(/f/g, `
███████╗
██╔════╝
█████╗░░
██╔══╝░░
██║░░░░░
╚═╝░░░░░`)
  .replace(/g/g, `
░██████╗░
██╔════╝░
██║░░██╗░
██║░░╚██╗
╚██████╔╝
░╚═════╝░`)
  .replace(/h/g, `
██╗░░██╗
██║░░██║
███████║
██╔══██║
██║░░██║
╚═╝░░╚═╝`)
  .replace(/i/g, `
██╗
██║
██║
██║
██║
╚═╝`)
  .replace(/ì|í|ị|ỉ|ĩ|i/g, `
░░░░░██╗
░░░░░██║
░░░░░██║
██╗░░██║
╚█████╔╝
░╚════╝░`)
  .replace(/k/g, `
██╗░░██╗
██║░██╔╝
█████═╝░
██╔═██╗░
██║░╚██╗
╚═╝░░╚═╝`)
  .replace(/l/g, `
██╗░░░░░
██║░░░░░
██║░░░░░
██║░░░░░
███████╗
╚══════╝`)
  .replace(/m/g, `
███╗░░░███╗
████╗░████║
██╔████╔██║
██║╚██╔╝██║
██║░╚═╝░██║
╚═╝░░░░░╚═╝`)
  .replace(/n/g, `
███╗░░██╗
████╗░██║
██╔██╗██║
██║╚████║
██║░╚███║
╚═╝░░╚══╝`)
  .replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ|o/g, `
░█████╗░
██╔══██╗
██║░░██║
██║░░██║
╚█████╔╝
░╚════╝░`)
  .replace(/p/g, `
██████╗░
██╔══██╗
██████╔╝
██╔═══╝░
██║░░░░░
╚═╝░░░░░`)
  .replace(/q/g, `
░██████╗░
██╔═══██╗
██║██╗██║
╚██████╔╝
░╚═██╔═╝░
░░░╚═╝░░░`)
  .replace(/r/g, `
██████╗░
██╔══██╗
██████╔╝
██╔══██╗
██║░░██║
╚═╝░░╚═╝`)
  .replace(/s/g, `
░██████╗
██╔════╝
╚█████╗░
░╚═══██╗
██████╔╝
╚═════╝░`)
  .replace(/t/g, `
████████╗
╚══██╔══╝
░░░██║░░░
░░░██║░░░
░░░██║░░░
░░░╚═╝░░░`)
  .replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ|u/g, `
██╗░░░██╗
██║░░░██║
██║░░░██║
██║░░░██║
╚██████╔╝
░╚═════╝░`)
  .replace(/v/g, `
██╗░░░██╗
██║░░░██║
╚██╗░██╔╝
░╚████╔╝░
░░╚██╔╝░░
░░░╚═╝░░░`)
  .replace(/x/g, `
██╗░░██╗
╚██╗██╔╝
░╚███╔╝░
░██╔██╗░
██╔╝╚██╗
╚═╝░░╚═╝` )
  .replace(/ỳ|ý|ỵ|ỷ|ỹ|y/g, `
██╗░░░██╗
╚██╗░██╔╝
░╚████╔╝░
░░╚██╔╝░░
░░░██║░░░
░░░╚═╝░░░`)
  .replace(/w/g, `
░██╗░░░░░░░██╗
░██║░░██╗░░██║
░╚██╗████╗██╔╝
░░████╔═████║░
░░╚██╔╝░╚██╔╝░
░░░╚═╝░░░╚═╝░░`)
  .replace(/z/g, `
███████╗
╚════██║
░░███╔═╝
██╔══╝░░
███████╗
╚══════╝`)
  .replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, "");
  var arr = text.replace("\n", "").split("\n").filter(item => item.length != 0);
  var num = (arr.length/6)-1;
  var main = arr.slice(0,6);
  var extra = arr.splice(6);
  var msg = "";
  var mainlength = main.length;
  for(let i = 0; i < mainlength; i++) {
    var txt = main[i];
    for(let o = 0; o < num; o++) {
      txt += extra[i+(o*6)];
    }
    msg += txt+"\n";
  }
  api.sendMessage(msg, event.threadID, event.messageID);
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
else if (/(haha|😆|🤣|😂|😀|😃|😄)/ig.test(input.toLowerCase())) {
	
	if(config.autoReactions) {
	api.setMessageReaction("😆", event.messageID, (err) => {}, true);
	}
}
else if (/(sad|iyak|pain|sakit|agoi|hurt|😢|☹️|😭|😞|🙁)/ig.test(input.toLowerCase())) {
	if(config.autoReactions) {
	api.setMessageReaction("😢", event.messageID, (err) => {}, true);
	} 
}
else if (/(bobo|tangina|pota|puta|gago|tarantado|puke|pepe|tite|burat|kantutan|bubu|bubo|bobu|boobs|nipples|pussy)/ig.test(input.toLowerCase())) {
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
        	body: "@" + data[event.senderID]['name'] + ` unsent this message😐:\n\n'${msgs[event.messageID]}'`,
            mentions: [{
            	tag: '@' + data[event.senderID]['name'],
                id: event.senderID,
                fromIndex: 0
                }]
            }, event.threadID, event.messageID);
  }
 })
}

} 
          }
                    break;
                    
             
        }
       } 
    });
});