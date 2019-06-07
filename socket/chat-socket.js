//chat-socket.js

let count = 0; //user count

module.exports = function(chat, socket, sharedsession){
  chat.use(sharedsession(session), {
    autoSave:true
  });

  chat.on('connection', function(socket){ // if client connected
    socket.handshake.session.save();

    let name;

    if(socket.handshake.session.user === undefined){
      count++;
      chat.to(socket.id).emit('redirection', '/');
    }
    else{
      name = socket.handshake.session.user.name
      count++;
      console.log('user connected: ', name , getToday());

      chat.emit('receive message', name + ' joined the chat');
      chat.emit('receive message', count + ' people are chatting.');
    }

    socket.on('disconnect', function(){ // if client disconect
      count--;
      chat.emit('receive message', name + ' left the chat');
      chat.emit('receive message', count + ' people are chatting.');
      console.log('user disconnected: ', name , getToday());
      console.log(count + ' people are chatting.');
    });

    socket.on('send message', function(text){ // if client message sned
      if (text != ''){
        var msg = name + ' : ' + text;
        console.log(msg , getToday());
        chat.emit('receive message', msg);
      }
    });
  });
}
