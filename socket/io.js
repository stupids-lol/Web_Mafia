//io.js

module.exports = function(server, session){
  const io = require('socket.io')(server);
  const sharedsession = require("express-socket.io-session");
  const lobby = require('./lobby-socket.js')(io.of('/chatlobby'), sharedsession);
  const chat = require('./chat-socket.js')(io.of('/chat'), sharedsession);

  io.use(sharedsession(session), {
    autoSave:true
  });


  
}

function getToday(){
  var date = new Date();
  return date.getFullYear() +'.'+ (date.getMonth()+1) +'.'+ date.getDate() +' '+ date.getHours() +':'+ date.getMinutes() +':'+date.getSeconds();
}
