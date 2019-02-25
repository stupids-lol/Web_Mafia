//io.js

let count = 0; // user count

module.exports = function(server, session){
  const io = require('socket.io')(server);
  const sharedsession = require("express-socket.io-session");

  io.use(sharedsession(session), {
    autoSave:true
  });

  io.on('connection', function(socket){ // if client connected
    socket.handshake.session.save();

    let name;

    if(socket.handshake.session.user === undefined){
      count++;
      io.to(socket.id).emit('redirection', '/');
    }
    else{
      name = socket.handshake.session.user.name
      count++;
      console.log('user connected: ', name , getToday());

      io.emit('receive message', name + ' joined the chat');
      io.emit('receive message', count + ' people are chatting.');
    }

    socket.on('disconnect', function(){ // if client disconect
      count--;
      io.emit('receive message', name + ' left the chat');
      io.emit('receive message', count + ' people are chatting.');
      console.log('user disconnected: ', name , getToday());
      console.log(count + ' people are chatting.');
    });

    socket.on('send message', function(text){ // if client message sned
      if (text != ''){
        var msg = name + ' : ' + text;
        console.log(msg , getToday());
        io.emit('receive message', msg);
      }
    });
  });
  return io;
}

function getToday(){
  var date = new Date();
  return date.getFullYear() +'.'+ (date.getMonth()+1) +'.'+ date.getDate() +' '+ date.getHours() +':'+ date.getMinutes() +':'+date.getSeconds();
}
