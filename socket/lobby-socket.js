//lobby-socket.js

let num = 1;
let rooms = [];

module.exports = function(lobby, sharedsession, session){

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
      for(let i = 0; i < rooms.length; i++){
        if(rooms[i].no == no){
          socket.join(no);
          console.log('socket.join',no);
        }
      }
      lobby.emit('join room', no);
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
}
