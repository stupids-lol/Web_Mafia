//socket.js

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

  /*

  lobby

  */
  lobby.on('connection', function(socket){
    socket.handshake.session.save();

    socket.emit('new room', rooms);

    socket.on('create room', function(name){
      let data = {
        no: num,
        name: name,
        nop: 0,
        leader: socket.handshake.session.user.name,
        player: []
      }

      const no = num;

      num++;
      rooms.push(data);

      console.log(no);
      console.log('socket.join',no);
      socket.handshake.session.user.room = no;
      socket.handshake.session.user.join = no;

      console.log(socket.handshake.session.user);
      socket.handshake.session.save();

      lobby.emit('new room', [data]);

    });

    socket.on('join room', function(no){
      console.log(no);
      console.log('socket.join',no);
      socket.handshake.session.user.room = no;
      socket.handshake.session.user.join = no;

      console.log(socket.handshake.session.user);
      socket.handshake.session.save();
    });

  });


  chat.use(sharedsession(session), {
    autoSave:true
  });

  /*

  chat

  */
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

      lobby.emit('join update', room);

      for(let i =0; i < rooms.length; i++){
        if (rooms[i].no === room){
          rooms[i].nop++;
          rooms[i].player.push(socket.id);
          break;
        }
      }

      count++;
      console.log('user connected: ', name , getToday());

      let role = new Array('Mafia', 'Sky');

      function randomItem(a) {
        return a[Math.floor(Math.random() * a.length)];
      }

      let data = {
        role: randomItem(role)
      }

      socket.join(room);

      chat.to(room).emit('receive message', name + ' joined the chat');
      chat.to(room).emit('receive message', count + ' people are chatting.');
    }

    socket.on('disconnect', function(){ // if client disconect
      count--;
      chat.to(room).emit('receive message', name + ' left the chat');
      chat.to(room).emit('receive message', count + ' people are chatting.');
      console.log('user disconnected: ', name , getToday());
      console.log(count + ' people are chatting.');
      if(socket.handshake.session.user){
        socket.handshake.session.user.room = -1;
      }
      lobby.emit('leave update', socket.handshake.session.user.join);
      for(let i = 0; i < rooms.length; i++){
        if (rooms[i].no == socket.handshake.session.user.join){
          rooms[i].nop--;
          if(rooms[i].nop === 0){
            lobby.emit('del room', rooms[i].no);
            rooms.splice(i,1);
          }
          else{
            for(let j = 0; j < rooms[i].length; j++){
              if(rooms[i].player[j] == socket.id){
                lobby.emit('leave update');
                rooms[i].player.splice(j,1);
              }
            }
          }
          break;
        }
      }
      socket.handshake.session.user.join = 0;
      socket.handshake.session.save();
    });

    socket.on('send message', function(text){ // if client message sned
      if (text != ''){
        var msg = name + ' : ' + text;
        console.log(msg , getToday());
        console.log(socket.id)
        chat.to(room).emit('receive message', msg);
      }
    });



    /*

    chat
    game

    */
    socket.on('game start', function(){
      let day = 0;
      let room = socket.handshake.session.user.room;
      let player;
      let time = 0;

      for(let i = 0; i < rooms.length; i++){
        if(rooms[i].no == room){
          player = rooms[i].player;
          break;
        }
      }

      let jobs = [];
      jobs.push(1);
      if(player.length >= 4)jobs.push(1);
      for(let i = jobs.length; i < player.length; i++){
        jobs.push(0);
      }

      jobs.sort(function(){return 0.5-Math.random()});

      for (let i = 0; i < player.length; i++){
        chat.to(player[i]).emit('set job', jobs[i]);
      }
      day_timer();
      var a = setInterval(day_timer,1000);

      function day_timer() {
        if(day == 0){
          chat.to(room).emit('set day', day);
          day = 1;
          a = setInterval(day_timer,5000);
        }else{
          chat.to(room).emit('set day', day);
          day = 0;
          a = setInterval(day_timer,1000);
        }
      }
    });


  });
};

function getToday(){
  var date = new Date();
  return date.getFullYear() +'.'+ (date.getMonth()+1) +'.'+ date.getDate() +' '+ date.getHours() +':'+ date.getMinutes() +':'+date.getSeconds();
}
