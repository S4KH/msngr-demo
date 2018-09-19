const redisOptions = require('../config/redis')
// const Redis = require('ioredis'),
    // sub = new Redis(redisOptions),
    // pub = new Redis(redisOptions);
    // rMonitor = new Redis(redisOptions);
    
const redisAdapter = require('socket.io-redis')
const { GLOBAL_CHAT, USER_CONNECTED, USER_DISCONNECTED, MESSAGE_SENT, TYPING, MESSAGE_RECIEVED, GLOBAL_CHAT_ID } = require('./constants')
const { createUser, createChat, createMessage } = require('../utils/factories')

// TODO user connected on machine with 0 users
let users = {}


const globalChat = createChat({ isCommunity:true });
// var kafka = require('../lib/kafka-adapter');
let gio = null;

module.exports = (io, adapter = null) => {

  if(adapter === null) {
    adapter = redisAdapter(redisOptions);
  }
  io.adapter(adapter);
  gio = io;
  io.on('connection', (socket) => {
    console.log("<", socket.id, "> [", socket.handshake.address, "]");

    let sendMsgToChatFromUser = null;
    let sendTypingFromUser = null;
    socket.on(USER_CONNECTED, (user) => {
      user.socketId = socket.id;
      users[user.name] = user;
      socket.user = user;

      sendMsgToChatFromUser = sendMsgToChat(user.name);
      sendTypingFromUser = sendTyping(user.name);
      io.emit(USER_CONNECTED, users);
      // console.log(users);
    });

    socket.on(GLOBAL_CHAT, (cb) => {
      cb(globalChat);
    });

    socket.on(MESSAGE_SENT, ({chatId, msg}) => {
      if(sendMsgToChatFromUser !==null) {
        sendMsgToChatFromUser(chatId, msg);
      }
    });

    socket.on(TYPING, ({chatId, isTyping}) => {
      if(sendTypingFromUser!==null) {
        sendTypingFromUser(chatId, isTyping);
      }
    });

    socket.on('disconnect', function(reason){
      if("user" in socket) {
        delete users[socket.user.name];

        io.emit(USER_DISCONNECTED, users);
      }
      console.log("<"+socket.id+"> ["+socket.handshake.address+"] disconnected, reason: "+reason+".");
    });
  })
}

function sendMsgToChat(sender) {
  return (chatId, message) => {
    gio.emit(`${MESSAGE_RECIEVED}-${chatId}`, createMessage({message, sender}));
  }
}

function sendTyping(user) {
  return (chatId, isTyping) => {
    gio.emit(`${TYPING}-${chatId}`, {user, isTyping});
  }
}