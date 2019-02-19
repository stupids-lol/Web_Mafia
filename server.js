var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/',function(req, res){
  res.sendFile(__dirname + '/client.html');
});

var count = 0;
var nameDict = {};

io.on('connection', function(socket){
  count++;
  console.log('user connected: ', socket.id);

  socket.on('welcome', function(name){
    io.emit('receive message', name + ' joined the chat');
    io.emit('receive message', count + ' people are chatting.');
    console.log('hello! ' + name);
    console.log(count + ' people are chatting.');
    nameDict[socket.id] = name;
  });

  socket.on('disconnect', function(){
    count--;
    io.emit('receive message', nameDict[socket.id] + ' left the chat');
    console.log('user disconnected: ', socket.id);
    delete nameDict[socket.id];
  });

  socket.on('send message', function(name,text){
    if (text != ''){
      var msg = name + ' : ' + text;
      console.log(msg);
      io.emit('receive message', msg);
    }
  });
});

http.listen(3000, function(){
  console.log('User : ' + count);
  console.log(__dirname);
  console.log('server on!');
});
