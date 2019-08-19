//io.js

let num = 1;
let rooms = [];

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
};
