//io.js

let num = 1;
let rooms = [];
let count = 0;

module.exports = function(server, session){
  const io = require('socket.io')(server);
  const sharedsession = require("express-socket.io-session");
  const lobby = io.of('/chatlobby');
  const chat = io.of('/chat');

  lobby.use(sharedsession(session), {
    autoSave:true
  });

  lobby.on('connection', function(socket){
    socket.handshake.session.save();

    socket.emit('new room', rooms);

    socket.on('create room', function(name){
      let data = {
        no: num,
        name: name,
        nop: 0,
        leader: socket.handshake.session.user.name
      }
      num++;
      rooms.push(data);
      lobby.emit('new room', [data]);
    });

    socket.on('join room', function(no){
      console.log(no);
      console.log('socket.join',no);
      socket.handshake.session.user.room = no;
      socket.handshake.session.user.join = no;
      lobby.emit('join update', no)
      console.log(socket.handshake.session.user);
      socket.handshake.session.save();
    });
    socket.on('delete room', function(no){
      for(let i = 0; i < rooms.length; i++){
        if (rooms[i].no == no){
          rooms.splice(i,1);
        }
      }
      lobby.emit('del room', no);
    });
  });

  chat.use(sharedsession(session), {
    autoSave:true
  });
  chat.on('connection', function(socket){ // if client connected
    socket.handshake.session.save();
    let name;
    let room;
    console.log(socket.handshake.session.user);
    if(socket.handshake.session.user === undefined){
      count++;
      socket.emit('redirection', '/');
    }
    else if(socket.handshake.session.user.room === -1){
      count++;
      socket.emit('redirection', '/');
    }
    else{
      name = socket.handshake.session.user.name;
      room = socket.handshake.session.user.room;
      count++;
      console.log('user connected: ', name , getToday());

      socket.join(room);
      let data = {
        role: 1
      }
      socket.emit('role', [data]);

      console.log(data);

      chat.to(room).emit('receive message', name + ' joined the chat');
      chat.to(room).emit('receive message', count + ' people are chatting.');
    }

    socket.on('disconnect', function(){ // if client disconect
      count--;
      chat.to(room).emit('receive message', name + ' left the chat');
      chat.to(room).emit('receive message', count + ' people are chatting.');
      console.log('user disconnected: ', name , getToday());
      console.log(count + ' people are chatting.');
      socket.handshake.session.user.room = -1;
      socket.handshake.session.save();
    });

    socket.on('send message', function(text){ // if client message sned
      if (text != ''){
        var msg = name + ' : ' + text;
        console.log(msg , getToday());
        chat.to(room).emit('receive message', msg);
      }
    });
  }
};

function getToday(){
  var date = new Date();
  return date.getFullYear() +'.'+ (date.getMonth()+1) +'.'+ date.getDate() +' '+ date.getHours() +':'+ date.getMinutes() +':'+date.getSeconds();
}
