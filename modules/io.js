//io.js

let count = 0; // user count
let nameDict = {}; //mapping to socket id and name

module.exports = function(server){
  const io = require('socket.io')(server);
  io.on('connection', function(socket){ // if client connected
    count++;
    console.log('user connected: ', socket.id);

    socket.on('welcome', function(name){ // welcome socket
      io.emit('receive message', name + ' joined the chat');
      io.emit('receive message', count + ' people are chatting.');
      console.log('hello! ' + name);
      console.log(count + ' people are chatting.');
      nameDict[socket.id] = name;
    });

    socket.on('disconnect', function(){ // if client disconect
      count--;
      io.emit('receive message', nameDict[socket.id] + ' left the chat');
      io.emit('receive message', count + ' people are chatting.');
      console.log('user disconnected: ', socket.id);
      console.log(count + ' people are chatting.');
      delete nameDict[socket.id];
    });

    socket.on('send message', function(name,text){ // if client message sned
      if (text != ''){
        var msg = name + ' : ' + text;
        console.log(msg);
        io.emit('receive message', msg);
      }
    });
  });
  return io;
}
