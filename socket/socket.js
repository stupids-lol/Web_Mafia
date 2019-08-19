//io.js

module.exports = function(server, session){
  const io = require('socket.io')(server);
  const sharedsession = require("express-socket.io-session");
  const lobby = require('./lobby-socket.js')(io.of('/chatlobby'), sharedsession, session);
  const chat = require('./chat-socket.js')(io.of('/chat'), sharedsession, session);
};
