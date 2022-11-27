const fs = require("fs");
const { keep_alive } = require("./keep_alive.js");
const http = require('https');
const login = require("fca-unofficial");
const axios = require("axios");
const request = require('request');
const { Configuration, OpenAIApi } = require("openai");
const cd = {};
const msgs = {};

//─────┐ Configuration ┌─────

let prefix = "¢";

//─────┐ Admins ┌─────
let admin = [
'100084389502600',//Bot uid dont remove!
'100081144393297', 
'100087612000387'
];

//─────┐ Banned Users ┌─────
let banned = [
'',
''
];

//─────┐ Users close to Saiji ┌─────
let saijiKnowns = [
'100081144393297', 
'100049906099961', 
'100051330130511', 
'100066325386760', 
'100086626355512',
'100085474776785',
'100029962340759', 
'100025001870534',
'100027037117607',
'100068425178018', 
'100054226068547', 
'100087612000387'
];



async function getWiki(q) {
  out = await axios.get("https://en.wikipedia.org/api/rest_v1/page/summary/" + q).then((response) => { return response.data}).catch((error) => { return error })
  return out
}

async function qt() {
    let qoute = await axios.get("https://zenquotes.io/api/random").then((response) => { return response.data[0] }).catch((err) => { return "err " });
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

async function ai(prompt_msg){
const openai = new OpenAIApi(configuration);
const response = await openai.createCompletion("text-davinci-001", {
    prompt: prompt_msg,
    temperature: 0,
    max_tokens: 100,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    stop: ["input:"],
});
return response.data;
}

login({ appState: JSON.parse(fs.readFileSync('appstate.json', 'utf8')) }, (err, api) => {
    if (err) return console.error(err);
    api.setOptions({ listenEvents: true });
    const listenEmitter = api.listen(async (err, event) => {
        if (err) return console.error(err);
        
        switch (event.type) {
        	case "event":
                switch (event.logMessageType) {
                	//─────┐ Join Notify ┌─────
                    case "log:subscribe":
                        api.getThreadInfo(event.threadID, (err, data) => {
                        	var gcName = data.threadName;
                            let id =  event.logMessageData.addedParticipants[0].userFbId
                            
                            let botID = api.getCurrentUserID();
                            var arr = data.participantIDs;
                            var memberCount = arr.length;
                            
                            if (data.isGroup) {
                            	if (id == botID) {
                                let mess = {
                                    body: `Hello, thanks for adding me in this gc!`,attachment: fs.createReadStream(__dirname + '/join.gif')
                                }
                                api.changeNickname(`[${prefix}] » Saiji`, event.threadID, botID, (err) => {
                                        if (err) return console.error(err);
                                    });
                                    
                                api.sendMessage(mess, event.threadID);
                               } else {
                               	let mess = {
                                    body: `Hi there, ${event.logMessageData.addedParticipants[0].fullName} 😊\n┌────── ～●～ ──────┐\n─── Welcome to ${gcName} ───\n└────── ～●～ ──────┘\nYour'e the ${memberCount}th member of this gc!`,
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
                        break;
                      //─────┐ Leave Notify ┌─────
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
var gcName = gc.threadName;                                            //─────┐ Antiout ┌─────
api.addUserToGroup(id, event.threadID, (err,data) => {
          if (err) return api.sendMessage("Err", event.threadID);
});
//─────┐ Leave Message ┌─────
api.sendMessage({
    body: `‎Bye😞, ${data[prop].name} has left from the group '${gcName}', we will miss you!`,
    mentions: [{
    tag: data[prop].name,
    id: id,
}],
attachment: fs.createReadStream(__dirname + '/bye.gif')
                                                }, event.threadID)
                                            }
                                        }
                                    }
                                })
                            })
                        break;
                }
                break;
        	
        	case "message_reply":
        
        let msgid = event.messageID;
        let input = event.body;
        msgs[msgid] = input;

        //─────┐ Unsent a bot message ┌─────
       if(input.startsWith(`${prefix}unsent`)){
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

            case "message":
            //─────┐ Banning system ┌─────
            if(banned.includes(event.senderID)) {
            	api.setMessageReaction("🔴", event.messageID, (err) => {}, true);
            } else {
            	//─────┐ Auto Reactions ┌─────
                  if (admin.includes(event.senderID)) {
                     api.setMessageReaction("💚", event.messageID, (err) => {}, true);
                  }
                  else {
                  	
                     api.setMessageReaction("👍", event.messageID, (err) => {}, true);
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
	
//─────┐ Error command thrower ┌─────
if (input == (`${prefix}`)) {
	api.sendMessage(`Error please type '${prefix}help' to show cmd list.`, event.threadID, event.messageID);
}
//─────┐ Help List ┌─────                  
else if (input == (`${prefix}help`)) {
    let rqt = qt();
    rqt.then((response) => {
        api.sendMessage({
body:`｢Saiji Commands｣\n\n\n• ${prefix}waifu\n\n• ${prefix}cosplay\n\n• ${prefix}loli\n\n• ${prefix}milf\n\n• ${prefix}shoti\n\n• ${prefix}wiki\n\n• ${prefix}bible\n\n• ${prefix}info\n\n• ${prefix}catfact\n\n• ${prefix}dogfact\n\n• ${prefix}qtt\n\n• ${prefix}binary\n\n• ${prefix}repeat\n\n• ${prefix}uid\n\n• ${prefix}gid\n\n• ${prefix}unsent\n\n• ${prefix}groups\n\n• ${prefix}fact\n\n• ${prefix}lyrics\n\n• ${prefix}play\n\n• ${prefix}shortplay\n\n• ${prefix}sai\n\n• ${prefix}baybayin\n\n• ${prefix}morse\n\n• ${prefix}biden\n\n• ${prefix}say\n\n• ${prefix}setname\n\n• ${prefix}phub\n\n• ${prefix}doublestruck\n\n• ${prefix}aniqoute\n\n• ${prefix}pin\n\n• ${prefix}showpinned\n\n• ${prefix}pdt\n\n• ${prefix}docs\n\n• ${prefix}qr\n\n\nQOTD » ${response.q}`
        }, event.threadID, event.messageID);
  })
}
//─────┐ Bot Information ┌─────                
else if (input.startsWith(`${prefix}info`)) {
                        let data = input.split(" ");
                        if (data.length < 2) {
                        api.getUserID("libyzxy0", (err,data) =>{
                                api.sendMessage({
                                    body: `｢Saiji Info｣\n\nSaiji is a Facebook messenger chat bot made using NodeJS.\n\nCreated by ` + 'Jan Liby Dela Costa' + `\n\n｢Saiji Features｣\n\n» Anti Unsent\n\n» Auto Reply\n\n» Auto Reaction\n\n» Answer Any Questions\n\n» Solving Math\n\n» Fun\n\n｢Api Used｣\n\n» Fca-unofficialAPI\n\n» HerokumemeAPI\n\n» SomerandomAPI\n\n» Simsimini.netAPI\n\n» ZenquotesAPI\n\n» OpenAiAPI\n\n»ManhictAPI\n\n» PopcatxyzAPI\n\n» Bible.orgAPI\n\n» WikipediaAPI\n\n｢Developers that help｣\n\n» Marvin Saik\n\n» Mark Agero`,
                                    mentions: [{
                                        tag: 'Jan Liby Dela Costa',
                                        id: data[1].userID,
                                    }]
                                }, event.threadID,event.messageID);
                            });
    }
}
                            
                            
//─────┐ Smart Saiji ┌─────
if(input.startsWith(`${prefix}sai`)) {
    let data = input.split(`${prefix}sai `);
    if (data.length < 2) {
    if (saijiKnowns.includes(event.senderID)){
        api.setMessageReaction("😍", event.messageID, (err) => {}, true);
        api.sendMessage("Bakit lolovesss??", event.threadID, event.messageID);
    } else {
		api.setMessageReaction("🖕", event.messageID, (err) => {}, true);
		api.sendMessage("Bakit nnmn?, tanginamo.", event.threadID, event.messageID);
    } 
    } else {     
    let a = ai(data[1])
    a.then((response) => {
        api.sendMessage(response.choices[0].text, event.threadID, event.messageID);
    })
 }
}
//─────┐ Trippings Saiji ┌─────
else if (input.startsWith("Sai")) {
            let data = input.split(" ");
            if (data.length < 2) {
                if (saijiKnowns.includes(event.senderID)){
                	api.setMessageReaction("😍", event.messageID, (err) => {}, true);
                	api.sendMessage("Bakit lolovesss??", event.threadID, event.messageID);
	} else {
		api.setMessageReaction("🖕", event.messageID, (err) => {}, true);
		api.sendMessage("Bakit nnmn?, tanginamo.", event.threadID, event.messageID);
    } 
            } else {
                try {
                    data.shift()
                    let txt = data.join(" ");
                axios.get(`https://api.simsimi.net/v2/?text=${txt}&lc=ph&cf=false&name=Joyce`)
                        .then(response => {
api.sendMessage(response.data['success'], event.threadID, event.messageID);
                        })
                } catch (err) {
                    api.sendMessage(`[ ERR ] ${err.message}`, event.threadID, event.messageID);
                    }
                }
          }


else if (input.startsWith(`${prefix}play`)) {
            let data = input.split(" ");
            if (data.length < 2) {
                api.sendMessage(`⚠️Invalid Use Of Command!\n💡Usage : ${prefix}play song_title`, event.threadID, event.messageID);
            } else {
                try {
                    data.shift()

                    let txt = data.join(" ");
                    api.sendMessage(`🔍Searching for '${txt}'`, event.threadID, event.messageID)
                    
                axios.get(`https://manhict.tech/api/scSearch?query=${txt}&apikey=E8QAKPmf`)
                        .then(response => {
                        if(response.data.result[0] == undefined) {
                        	api.sendMessage("Music not found!", event.threadID, event.messageID)
                       } else {
                        
                       request(encodeURI(`${response.data.result[0]['audio']}`)).pipe(fs.createWriteStream(__dirname + '/cache/music.mp3')).on('finish',() =>{
                        var message = {
                                                body:`Here's your music, enjoyy!🥰\n\nSong Title » ${response.data.result[0]['title']}\nDuration » ${response.data.result[0]['duration']}\n\nEnjoyy listening!`,
                                                attachment: fs.createReadStream(__dirname + '/cache/music.mp3'),
                                            }
                                            api.sendMessage(message, event.threadID, event.messageID);
                       })
                      } 
                     })
                       
                } catch (err) {
                    api.sendMessage(`[ ERR ] ${err}`, event.threadID, event.messageID);
                    }
                }
          }
          
          
else if (input.startsWith(`${prefix}shortplay`)) {
            let data = input.split(" ");
            if (data.length < 2) {
                api.sendMessage(`⚠️Invalid Use Of Command!\n💡Usage : ${prefix}shortplay song_title`, event.threadID, event.messageID);
            } else {
                try {
                    data.shift()
                    let txt = data.join(" ");
                axios.get(`https://manhict.tech/api/spSearch?query=${txt}&apikey=E8QAKPmf`)
                        .then(response => {
                       request(encodeURI(`${response.data.result[0]['preview_audio']}`)).pipe(fs.createWriteStream(__dirname + '/cache/shortplay.mp3')).on('finish',() =>{
                        var message = {
                                                body:``,
                                                attachment: fs.createReadStream(__dirname + '/cache/shortplay.mp3'),
                                            }
                                            api.sendMessage(message, event.threadID, event.messageID);
                       }) 
                        })
                } catch (err) {
                    api.sendMessage(`[ ERR ] ${err}`, event.threadID, event.messageID);
                    }
               } 
          }


else if (input.startsWith(`${prefix}fbdl`)) {
            let data = input.split(" ");
            if (data.length < 2) {
                api.sendMessage(`⚠️Invalid Use Of Command!\n💡Usage : ${prefix}fbdl url`, event.threadID, event.messageID);
            } else {
                try {
                    data.shift()
                    let txt = data.join(" ");
                axios.get(`https://manhict.tech/api/fbDL?url=${txt}&apikey=E8QAKPmf`)
                        .then(response => {
                        	api.sendMessage(`Downloading please wait...`, event.threadID, event.messageID);
                       request(encodeURI(`${response.data.result.hd}`)).pipe(fs.createWriteStream(__dirname + '/cache/fbdl.mp4')).on('finish',() =>{
                        var message = {
                                                body:`Facebook Video Downloader`,
                                                attachment: fs.createReadStream(__dirname + '/cache/fbdl.mp4'),
                                            }
                                            api.sendMessage(message, event.threadID, event.messageID);
                       }) 
                        })
                } catch (err) {
                    api.sendMessage(`[ ERR ] ${err}`, event.threadID, event.messageID);
                    }
                }
          }


else if (input.startsWith(`${prefix}test`)) {
	        let text = input;
	        text = text.substring(5);
            let data = input.split(" ");
            if (data.length < 2) {
                api.sendMessage(`⚠️Invalid Use Of Command!\n💡Usage : ${prefix}test text`, event.threadID, event.messageID);
            } else {
                try {
                    data.shift()
                        	api.getUserInfo(event.senderID, (err, data) => {
                        
  let url = `https://manhict.tech/api/avtWibu4?id=7&tenchinh=${text}&tenphu=${data[event.senderID]['name']}&apikey=E8QAKPmf`;
  	request(encodeURI(`${url}`)).pipe(fs.createWriteStream(__dirname + '/cache/test.png')).on('finish',() => {
		var message = {
                                                body:``,
                                                attachment: fs.createReadStream(__dirname + '/cache/test.png'),
                                            }
                                            api.sendMessage(message, event.threadID, event.messageID);
		})
		})
                } catch (err) {
                    api.sendMessage(`[ ERR ] ${err}`, event.threadID, event.messageID);
                    
                    }
                   } 
          }



//─────┐ Random Qoutes ┌─────
else if (input.startsWith(`${prefix}qtt`)) {
	try {
        let axios = require('axios');
	const res = await axios.get(`https://api.popcat.xyz/pickuplines`);
	var data = res.data;
	return api.sendMessage(`${data.pickupline}`, event.threadID, event.messageID);
		} catch (err) {
        return api.sendMessage(`Err ${err}`, event.threadID)
    }
}
//─────┐ List of groups ┌─────           
else if (input.startsWith(`${prefix}groups`)){
	var num = 0, box = "____________GROUPLIST____________\n\n";
	api.getThreadList(100, null, ["INBOX"], (err, list) => {
		list.forEach(info => {
			if (info.isGroup && info.isSubscribed) {
				box += `Group: ${info.name} \nGroupID: ${info.threadID}\n\n`;
			}			
		})
		return api.sendMessage(box, event.threadID, event.messageID);
	})
}
//─────┐ Bible verses ┌─────                     
else if(input.startsWith(`${prefix}bible`)){
                                    let v = verse()
                                    v.then((response) => {
                                        api.sendMessage(`${response.bookname} ${response.chapter}:${response.verse}\n\n${response.text}`, event.threadID, event.messageID)
                                    }).catch((err) => {
                                        console.log(err)
})
}
//─────┐ Meme Images ┌─────
else if (input.startsWith(`${prefix}meme`)){
          axios.get('https://meme-api.herokuapp.com/gimme/memes')
                  .then(response => {
                    var mention = Object.keys(event.mentions)[0];
                     var file = fs.createWriteStream("cache/memes.png");
                     var targetUrl = response.data.url;
                     var gifRequest = http.get(targetUrl, function (gifResponse) {
                        gifResponse.pipe(file);
                        file.on('finish', function () {
                           var message = {
                              body: response.data.title + "\n\nAuthor: " + response.data.author,
                              attachment: fs.createReadStream(__dirname + '/cache/memes.png')
                           }
                           api.sendMessage(message, event.threadID, event.messageID);
                           api.setMessageReaction("😆", event.messageID, (err) => {}, true);
                        });
                     });
                  })
                  .catch(error => {
                     api.sendMessage("Failed to generate Memes, please try again!", event.threadID, event.messageID);
                  })
                }
//─────┐ Loli Pictures ┌─────               
else if (input.startsWith(`${prefix}loli`)){
                                
          axios.get('https://saikiapi.herokuapp.com/loli2')
                  .then(response => {
                    var mention = Object.keys(event.mentions)[0];
                     var file = fs.createWriteStream("cache/loli.png");
                     var targetUrl = response.data.url;
                     var gifRequest = http.get(targetUrl, function (gifResponse) {
                        gifResponse.pipe(file);
                        file.on('finish', function () {
                           var message = {
                              body: "Lolis", attachment: fs.createReadStream(__dirname + '/cache/loli.png')
                           }
                           api.sendMessage(message, event.threadID, event.messageID);
                           api.setMessageReaction("😆", event.messageID, (err) => {}, true);
                        });
                     });
                  })
                  .catch(error => {
                     api.sendMessage("Failed to generate Image, please try again!", event.threadID, event.messageID);
                  })
                }
//─────┐ 18+ Contents [Don't use] ┌─────
else if (input.startsWith(`${prefix}milf`)){
          axios.get('https://meme-api.herokuapp.com/gimme/hentai')
                  .then(response => {
                    var mention = Object.keys(event.mentions)[0];
                     var file = fs.createWriteStream("cache/milf.png");
                     var targetUrl = response.data.url;
                     var gifRequest = http.get(targetUrl, function (gifResponse) {
                        gifResponse.pipe(file);
                        file.on('finish', function () {
                           var message = {
                              body: "————18+ content————", attachment: fs.createReadStream(__dirname + '/cache/milf.png')
                           }
                           api.sendMessage(message, event.threadID, event.messageID);
                           api.setMessageReaction("🔞", event.messageID, (err) => {}, true);
                        });
                     });
                  })
                  .catch(error => {
                     api.sendMessage("Failed to generate Image, please try again!", event.threadID, event.messageID);
                  })
                }
//─────┐ Cosplay pictures ┌─────               
else if (input.startsWith(`${prefix}cosplay`)){
                                
          axios.get('https://meme-api.herokuapp.com/gimme/cosplay')
                  .then(response => {
                    var mention = Object.keys(event.mentions)[0];
                     var file = fs.createWriteStream("cache/cosplay.png");
                     var targetUrl = response.data.url;
                     var gifRequest = http.get(targetUrl, function (gifResponse) {
                        gifResponse.pipe(file);
                        file.on('finish', function () {
                           var message = {
                              body: response.data.title, attachment: fs.createReadStream(__dirname + '/cache/cosplay.png')
                           }
                           
                           api.sendMessage(message, event.threadID, event.messageID);
                           
                           
                           
                        });
                     });
                  })
                  .catch(error => {
                     api.sendMessage("Failed to generate Image, please try again!", event.threadID, event.messageID);
                  })
                }
//─────┐ Waifu Pictures ┌─────
else if (input.startsWith(`${prefix}waifu`)) {
     try {
        let axios = require('axios');
        let fs = require("fs");
        let request = require("request");
        var res = await axios.get(`https://meme-api.herokuapp.com/gimme/waifu`);
	
	var data = res.data;
	let callback = function() {
            return api.sendMessage({
                body:`${data.title}`,
                attachment: fs.createReadStream(__dirname + `/cache/waifu.png`)
            }, event.threadID, () => fs.unlinkSync(__dirname + `/cache/waifu.png`), event.messageID);
        };
		return request(encodeURI(data.url)).pipe(fs.createWriteStream(__dirname + `/cache/waifu.png`)).on("close", callback);
		} catch (err) {
        return api.sendMessage(`${err}`, event.threadID)
    }
}
//─────┐ Shoti tiktok vids ┌─────
if(input.startsWith(`${prefix}shoti`)){
    await axios.get(`https://testapi.libyzxy0.repl.co/?data=tiktokvids`).then((r) => {
         let res = r.data
         request(encodeURI(`${res.url}`)).pipe(fs.createWriteStream(__dirname + '/cache/shoti.mp4')).on('finish',() =>{
    var message = {
          body: `🫶🫶`,
         attachment: 
fs.createReadStream(__dirname + '/cache/shoti.mp4')
    }
    
    api.sendMessage(message, event.threadID, event.messageID)
    })                
    }).catch((e) => {
        console.error(e)
    })
                        
}

//─────┐ Saiji documentations ┌─────
else if (input.startsWith(`${prefix}docs`)) {
    api.sendMessage(`If you don't know how to use saiji, kindy read her documentation on the link, below\n\nhttps://liby0.vercel.app/saijidocumentations`, event.threadID, event.messageID)
}
//─────┐ Dog pictures and dog facts ┌─────
else if (input.startsWith(`${prefix}dogfact`)) {
	try {
        let axios = require('axios');
        let fs = require("fs");
        let request = require("request");
        let {threadID, senderID, messageID} = event;
	const res = await axios.get(`https://some-random-api.ml/animal/dog`);
	var data = res.data;
	let callback = function() {
            return api.sendMessage({
                body:`————🐶Dog fact🐶————\n\n${data.fact}`,
                attachment: fs.createReadStream(__dirname + `/cache/dog.jpg`)
            }, event.threadID, () => fs.unlinkSync(__dirname + `/cache/dog.jpg`), event.messageID);
        };
		return request(encodeURI(data.image)).pipe(fs.createWriteStream(__dirname + `/cache/dog.jpg`)).on("close", callback);
		} catch (err) {
        return api.sendMessage(`Err ${err}`, event.threadID)
    }
}
//─────┐ Cat pictures and cat facts ┌─────
else if (input.startsWith(`${prefix}catfact`)) {
	try {
        let axios = require('axios');
        let fs = require("fs");
        let request = require("request");
        let {threadID, senderID, messageID} = event;
	const res = await axios.get(`https://some-random-api.ml/animal/cat`);
	var data = res.data;
	let callback = function() {
            return api.sendMessage({
                body:`————🐱Cat fact🐱————\n\n${data.fact}`,
                attachment: fs.createReadStream(__dirname + `/cache/cat.jpg`)
            }, event.threadID, () => fs.unlinkSync(__dirname + `/cache/cat.jpg`), event.messageID);
        };
		return request(encodeURI(data.image)).pipe(fs.createWriteStream(__dirname + `/cache/cat.jpg`)).on("close", callback);
		} catch (err) {
        return api.sendMessage(`Err ${err}`, event.threadID)
    }
}
//─────┐ Baybayin [Idk this cmd] ┌─────
if(input.startsWith(`${prefix}baybayin`)){
                    let data = input.split(" ")
                    data.shift()
                    if(data.length > 0){
                        await axios.get("https://api-baybayin-transliterator.vercel.app?text=" + data.join(" ")).then((r) => {
                          let res = r.data
                          api.sendMessage(res.baybay, event.threadID)
                        }).catch((e) => {
                          console.error(e)
                        })
                    } else{
                      api.sendMessage("Undefined request", event.threadID)
                    }
                  }
//─────┐ Morse code ┌─────                  
if(input.startsWith(`${prefix}morse`)){
                    let data = input.split(" ")
                    data.shift()
                    if(data.length > 0){
                        await axios.get("https://api.popcat.xyz/texttomorse?text=" + data.join(" ")).then((r) => {
                          let res = r.data
                          api.sendMessage(res.morse, event.threadID)
                        }).catch((e) => {
                          console.error(e)
                        })
                    } else{
                      api.sendMessage("Undefined request", event.threadID, event.messageID)
                    }
                  }
//─────┐ Song lyrics ┌─────                  
if(input.startsWith(`${prefix}lyrics`)){
                    let data = input.split(" ")
                    data.shift()
                    if(data.length > 0){
                        await axios.get(`https://api.popcat.xyz/lyrics?song=${data.join(" ")}`).then((r) => {
                          let res = r.data
                          api.sendMessage(`Title : ${res.title}\nArtist : ${res.artist}\n\n${res.lyrics}`, event.threadID, event.messageID)
                        }).catch((e) => {
                          console.error(e)
                        })
                    } else{
                      api.sendMessage("Undefined request", event.threadID)
                    }
                  }
//─────┐ Doublestruck font ┌─────
if(input.startsWith(`${prefix}doublestruck`)){
                    let data = input.split(" ")
                    data.shift()
                    if(data.length > 0){
                        await axios.get(`https://api.popcat.xyz/doublestruck?text=${data.join(" ")}`).then((r) => {
                          let res = r.data
                          api.sendMessage(`${res.text}`, event.threadID, event.messageID)
                        }).catch((e) => {
                          console.error(e)
                        })
                    } else{
                      api.sendMessage("Undefined request", event.threadID)
                    }
                  }

//─────┐ Anime qoute ┌─────
if(input.startsWith(`${prefix}aniqoute`)){
                        await axios.get(`https://some-random-api.ml/animu/quote`).then((r) => {
                          let res = r.data
                          api.sendMessage(`${res.sentence}\n\n- ${res.character}`, event.threadID, event.messageID)
                        }).catch((e) => {
                          console.error(e)
                        })
                  }
                  
//─────┐ Say a word ┌─────                  
if(input.startsWith(`${prefix}say`)) {
	  let text = input;
	  text = text.substring(4)
      let data = input.split(" ")
      if (data.length < 2) {
       api.sendMessage(`⚠️Invalid Use Of Command!\n💡Usage : ${prefix}say [Text]`, event.threadID, event.messageID);
      } else {
         var url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${text}&tl=en&client=tw-ob`
         request(encodeURI(`${url}`)).pipe(fs.createWriteStream(__dirname + '/cache/say.mp3')).on('finish',() =>{
         	var message = {
                                                body:``,                                               attachment: fs.createReadStream(__dirname + '/cache/say.mp3'),
                                            }
                                            api.sendMessage(message, event.threadID, event.messageID);
        })
	} 
}

//─────┐ Periodictable ┌─────                                   
if(input.startsWith(`${prefix}pdt`)){
                    let data = input.split(" ")
                    data.shift()
                    if(data.length > 0){
                        await axios.get("https://api.popcat.xyz/periodic-table?element=" + data.join(" ")).then((r) => {
                        let res = r.data
                        var image = res.image;
                        request(encodeURI(`${image}`)).pipe(fs.createWriteStream(__dirname + '/cache/pdt.png')).on('finish',() =>{
                                                            var message = {
                                                body:`${res.name}\n\nSymbol : ${res.symbol}\nAtomic Number : ${res.atomic_number}\nAtomic Mass : ${res.atomic_mass}\nPeriod : ${res.period}\nPhase : ${res.phase}\nDiscovered by : ${res.discovered_by}\n\nSummary\n${res.summary}`,
                                                attachment: fs.createReadStream(__dirname + '/cache/pdt.png'),
                                            }
                                            api.sendMessage(message, event.threadID, event.messageID);
                         })                   
                        }).catch((e) => {
                          console.error(e)
                        })
                    } else{
                      api.sendMessage("Undefined request", event.threadID, event.messageID)
                    }
                   }
                   
//─────┐ Binary code ┌─────                 
else if (input.startsWith(`${prefix}binary`)){
    text = input;
	text = text.substring(7)
    let data = input.split(" ");
    let output = ""

    for(let a = 0; a < text.length; a++){
        let data = text.charCodeAt(a)
        output += "0" + data.toString(2) + " "
    }
    if (data.length < 2) {
        api.sendMessage("⚠️Invalid Use Of Command!\n💡Usage: binary [txt]", event.threadID);
        } else {
            api.sendMessage(`${output}`, event.threadID, event.messageID);
        }
}
//─────┐ Generate qr code ┌─────            
else if (input.startsWith(`${prefix}qr`)) {
	text = input;
	text = text.substring(7)
    let data = input.split(" ");
    if (data.length < 2) {
        api.sendMessage(`⚠️Invalid Use Of Command!\n💡Usage: ${prefix}qr [txt]`, event.threadID);
        } else {
        	
                var image = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${text}`;
                request(encodeURI(`${image}`)).pipe(fs.createWriteStream(__dirname + '/cache/qrcode.png')).on('finish',() =>{
                	var message = {
                                                body:``,
                                                attachment: fs.createReadStream(__dirname + '/cache/qrcode.png'),
                                            }
                                            api.sendMessage(message, event.threadID, event.messageID);
    }) 
  }
}


//─────┐ Phub [txt] ┌─────
else if (input.startsWith(`${prefix}phub`)) {
	text = input;
	text = text.substring(5)
    let data = input.split(" ");
    if (data.length < 2) {
        api.sendMessage(`⚠️Invalid Use Of Command!\n💡Usage: ${prefix}phub [txt]`, event.threadID);
        } else {
            api.getUserInfo(event.senderID, (err, data) => {
           if (err) return console.error(err);
           else {
           	
           	let url = `https://manhict.tech/api/phubcmt?text=${text}&uid=${event.senderID}&name=${data[event.senderID]['name']}&apikey=E8QAKPmf`;
           
           request(encodeURI(`${url}`)).pipe(fs.createWriteStream(__dirname + '/cache/phub.png')).on('finish',() =>{
           	
           var message = {
body:``,                                               attachment: fs.createReadStream(__dirname + '/cache/phub.png'),
} 
api.sendMessage(message, event.threadID, event.messageID);
           
           	}) 
             } 
        }) 

  }
}





//─────┐ Repeat your word ┌─────                     
else if (input.startsWith(`${prefix}repeat`)) {
	text = input;
	text = text.substring(7)
    let data = input.split(" ");
    if (data.length < 2) {
        api.sendMessage("⚠️Invalid Use Of Command!\n💡Usage: reapeat [txt]", event.threadID);
        } else {
            api.sendMessage(`${text}`, event.threadID, event.messageID);
  }
}

//─────┐ Get user ID ┌─────
else if (input.startsWith(`${prefix}uid`)) {
    if (Object.keys(event.mentions) == 0) return api. sendMessage(`${event.senderID}`, event.threadID, event.messageID);
	else {
		for (var i = 0; i < Object.keys(event.mentions).length; i++) api.sendMessage(`${Object.values(event.mentions)[i].replace('@', '')}: ${Object.keys(event.mentions)[i]}`, event.threadID);
		return;
  }
}
else if (input.startsWith(`${prefix}gid`)) {
    api. sendMessage(`${event.threadID}`, event.threadID, event.messageID);
}
//─────┐ Joe Biden Tweet ┌─────
else if (input.startsWith(`${prefix}biden`)) {
    let text = input;
    text = text.substring(6)
    let url = `https://api.popcat.xyz/biden?text=${text}`;
    request(encodeURI(`${url}`)).pipe(fs.createWriteStream(__dirname + '/cache/biden.png')).on('finish',() =>{
    var message = {
          body: ``,
         attachment: 
fs.createReadStream(__dirname + '/cache/biden.png')
    }
    api.sendMessage(message, event.threadID, event.messageID)
   }) 
}

//─────┐ Fact [txt] ┌─────
else if (input.startsWith(`${prefix}fact`)) {
    let text = input;
    text = text.substring(5)
    let url = `https://api.popcat.xyz/facts?text=${text}`;
    request(encodeURI(`${url}`)).pipe(fs.createWriteStream(__dirname + '/cache/fact.png')).on('finish',() =>{
    var message = {
          body: ``,
         attachment: 
fs.createReadStream(__dirname + '/cache/fact.png')
    }
    api.sendMessage(message, event.threadID, event.messageID)
   }) 
}

        //─────┐ Pin a message ┌─────
if (input.startsWith(`${prefix}pin`)) {
	    let message = input;
	    message = message.substring(4)
    	api.getUserInfo(event.senderID, (err, data) =>{
    	const fs = require("fs");
        const newObject = {
        	msg: message,
            name: data[event.senderID]['name'], 
            id: event.senderID
        }
        fs.writeFile('./cache/pinned.json', JSON.stringify(newObject), err => {
        	if(err) {
        	console.log(err)
            } else {
          	api.sendMessage("Message pinned!", event.threadID, event.messageID) 
        	}
       })
      })      	
} 
//─────┐ Show a pinned message ┌─────
else if (input.startsWith(`${prefix}showpinned`)) {
	const fs = require("fs");
	fs.readFile('./cache/pinned.json', 'utf-8', (err, jsonString) => {
    if(err) {
    	console.log(err)
   } else {
   	const data = JSON.parse(jsonString);
       api.sendMessage({
                                body: `｢Pinned message｣\n\n${data.msg}\n\nFrom : ${data.name}`,
                                mentions: [{
                                    tag: data.name,
                                    id: data.id,
                                }],
                            }, event.threadID, event.messageID);
   } 
})
}
//─────┐ Last message ┌─────
else if (input.startsWith(`${prefix}lastmsg`)) {
	const fs = require("fs");
	fs.readFile('./cache/lastMessage.json', 'utf-8', (err, jsonString) => {
    if(err) {
    	console.log(err)
   } else {
   	const data = JSON.parse(jsonString);
       api.sendMessage({
                                body: `｢Last message｣\n\n${data.msg}\n\nFrom : ${data.name}`,
                                mentions: [{
                                    tag: data.name,
                                    id: data.id,
                                }],
                            }, event.threadID, event.messageID);
   } 
})
}
//─────┐ Auto Reactions ┌─────
else if (/(haha|happy|😆|😂|🤣)/ig.test(input.toLowerCase())) {
	api.setMessageReaction("😆", event.messageID, (err) => {}, true);
}
else if (/(agoi|sad|iyak|hays|pain|sakit|aguy|lungkot|hurt|☹️|😢|😭|🙁|😟|😞)/ig.test(input.toLowerCase())) {
	api.setMessageReaction("😢", event.messageID, (err) => {}, true);
}
else if (/(salamat|thankyou|love|ty|mahal)/ig.test(input.toLowerCase())) {
	api.setMessageReaction("💚", event.messageID, (err) => {}, true);
}
//─────┐ Badwords detection ┌─────
else if (/(tangina|bobo|bubu|hayop|puke|tite|inamo|gago|pota|puta|bonak)/ig.test(input.toLowerCase())) {
	api.setMessageReaction("✖️", event.messageID, (err) => {}, true);
}

//─────┐ Auto reply ┌─────
else if (/(evening|magandang gabi)/ig.test(input.toLowerCase())) {
                        api.getUserInfo(event.senderID, (err, data) => {
                            api.sendMessage({
                                body: "Good Evening " + '@' +
                                  data[event.senderID]['name'] + "\n\nEvenings are ways to end the days stress and struggle. I hope you didn't give yourself too much stress.Have a great evening.",
                                mentions: [{
                                    tag: '@' + data[event.senderID]['name'],
                                    id: event.senderID,
                                    fromIndex: 0
                                }],
                            }, event.threadID, event.messageID)
                        })
                    }

else if (/(tutulog|night)/ig.test(input.toLowerCase())) {
                        api.getUserInfo(event.senderID, (err, data) => {
                            api.sendMessage({
                                body: "Good Night " + '@' +
                                  data[event.senderID]['name'] + "\n\nWishing you the sweetest dreams as you drift off to sleep.",
                                mentions: [{
                                    tag: '@' + data[event.senderID]['name'],
                                    id: event.senderID,
                                    fromIndex: 0
                                }],
                            }, event.threadID, event.messageID)
                        })
                    }
                   
else if (/(magandang umaga|morning)/ig.test(input.toLowerCase())) {
                        api.getUserInfo(event.senderID, (err, data) => {
                            api.sendMessage({
                                body: "Good Morning too " + '@' +
                                  data[event.senderID]['name'] + ", don't forget to eat your breakfast, have a good day.",
                                mentions: [{
                                    tag: '@' + data[event.senderID]['name'],
                                    id: event.senderID,
                                    fromIndex: 0
                                }],
                            }, event.threadID, event.messageID)
                        })
                    }

else if (input.startsWith(`${prefix}setname`)) {
            var name = input;
            name = name.substring(8)
            let data = input.split(" ")
            data.shift()
            const mention = Object.keys(event.mentions)[0];
            if (!mention) return api.changeNickname(`${name}`, event.threadID, event.senderID);
            if (mention[0]) return api.changeNickname(`${name.replace(event.mentions[mention], "")}`, event.threadID, mention);
}

//─────┐ Wikipedia ┌─────
else if (input.startsWith(`${prefix}wiki`)) {
                        
                        let data = input.split(" ");
                        if (data.length < 2) {
                            api.sendMessage(`⚠️Invalid Use Of Command!\n💡Usage: ${prefix}wiki <word>`, event.threadID);
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
                            }
                            catch (err) {
                                api.sendMessage(`⚠️${err.message}`, event.threadID, event.messageID);
                           }
                       }
                   }
//─────┐ End of commands ┌─────
               }
}
          break;
          //─────┐ Anti unsent ┌─────
            case "message_unsend":
                if (!admin.includes(event.senderID)) {
                    let d = msgs[event.messageID];
                    if (typeof (d) == "object") {
                        api.getUserInfo(event.senderID, (err, data) => {
                            if (err) return console.error(err);
                            else {
                                if (d[0] == "img") {
                                    var file = fs.createWriteStream("cache/unsentphoto.jpg");
                                    var gifRequest = http.get(d[1], function (gifResponse) {
                                        gifResponse.pipe(file);
                                        file.on('finish', function () {
                                            var message = {
                                                body:`${data[event.senderID]['name']} unsent this photo: \n`,
                                                attachment: fs.createReadStream(__dirname + '/cache/unsentphoto.jpg')
                                            }
                                            api.sendMessage(message, event.threadID);
                                        });
                                    });
                                }
                                else if (d[0] == "gif") {
                                    var file = fs.createWriteStream("cache/unsentanimated_image.gif");
                                    var gifRequest = http.get(d[1], function (gifResponse) {
                                        gifResponse.pipe(file);
                                        file.on('finish', function () {
                                            var message = {
                                                body:`${data[event.senderID]['name']} unsent this GIF \n`,
                                                attachment: fs.createReadStream(__dirname + '/cache/unsentanimated_image.gif')
                                            }
                                            api.sendMessage(message, event.threadID);
                                        });
                                    });
                                }
                                else if (d[0] == "sticker") {
                                    var file = fs.createWriteStream("cache/unsentsticker.png");
                                    var gifRequest = http.get(d[1], function (gifResponse) {
                                        gifResponse.pipe(file);
                                        file.on('finish', function () {
                                            var message = {
                                                body:`${data[event.senderID]['name']} unsent this Sticker \n`,
                                                attachment: fs.createReadStream(__dirname + '/cache/unsentsticker.png')
                                            }
                                            api.sendMessage(message, event.threadID);
                                        });
                                    });
                                }
                                else if (d[0] == "vid") {
                                    var file = fs.createWriteStream("cache/unsentvideo.mp4");
                                    var gifRequest = http.get(d[1], function (gifResponse) {
                                        gifResponse.pipe(file);
                                        file.on('finish', function () {
                                            var message = {
                                                body:`${data[event.senderID]['name']} unsent this video\n`,
                                                attachment: fs.createReadStream(__dirname + '/cache/unsentvideo.mp4')
                                            }
                                            api.sendMessage(message, event.threadID);
                                        });
                                    });
                                }
                                else if (d[0] == "vm") {
                                    var file = fs.createWriteStream("cache/unsentvoicemessage.mp3");
                                    var gifRequest = http.get(d[1], function (gifResponse) {
                                        gifResponse.pipe(file);
                                        file.on('finish', function () {
                                            var message = {
                                                body:`${data[event.senderID]['name']} unsent this audio\n`,
                                                attachment: fs.createReadStream(__dirname + '/cache/unsentvoicemessage.mp3'),
                                            }
                                            api.sendMessage(message, event.threadID);
                                        });
                                    });
                                }
                            }
                        });
                    }
                    else {
                        api.getUserInfo(event.senderID, (err, data) => {
                            if (err) return console.error(err);
                            else {
                                api.sendMessage({
                                body: "@" + data[event.senderID]['name'] + ` unsent this message😐:\n\n'${msgs[event.messageID]}'`,
                                mentions: [{
                                    tag: '@' + data[event.senderID]['name'],
                                    id: event.senderID,
                                    fromIndex: 0
                                }],
                            }, event.threadID, event.messageID);
                            }
                        });
                        
                    }
                    break;
                    
                }
        }
    });
});