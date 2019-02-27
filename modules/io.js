//io.js

let count = 0; // user count
let num = 0;
let rooms = [];

module.exports = function(server, session){
  const io = require('socket.io')(server);
  const sharedsession = require("express-socket.io-session");


  const lobby = io.of('/chatlobby');

  io.use(sharedsession(session), {
    autoSave:true
  });

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
    })

    socket.on('delete room', function(no){
      for(let i = 0; i < rooms.length; i++){
        if (rooms[i].no == no){
          rooms.splice(i,1);
        }
      }
      socket.emit('del room', no);
    })
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
  return [io, lobby];
}

function getToday(){
  var date = new Date();
  return date.getFullYear() +'.'+ (date.getMonth()+1) +'.'+ date.getDate() +' '+ date.getHours() +':'+ date.getMinutes() +':'+date.getSeconds();
}
