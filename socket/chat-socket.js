//chat-socket.js

let count = 0;  //user count

module.exports = function(chat, sharedsession, session){
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
)}

function getToday(){
  var date = new Date();
  return date.getFullYear() +'.'+ (date.getMonth()+1) +'.'+ date.getDate() +' '+ date.getHours() +':'+ date.getMinutes() +':'+date.getSeconds();
}
