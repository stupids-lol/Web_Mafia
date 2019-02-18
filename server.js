// server.js

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/',function(req, res){
  res.sendFile(__dirname + '/client.html');
});

var count = 0;

var Countsend = setInterval(function() {
  io.emit('receive', count + ' people are chatting.');
  console.log(count + ' people are chatting.');
},60000);

io.on('connection', function(socket){
  count++;
  console.log('user connected: ', socket.id);

  socket.on('welcome', function(name){
    io.emit('receive message', name + ' joined the chat');
    console.log('hello! ' + name);
  })

  socket.on('disconnect', function(){
    count--;
    io.emit('receive message', name + 'disconnected the chat OTL');
    console.log('user disconnected: ', socket.id);
  });

  socket.on('user', function(name01){
    console.log(name01);
  });

  socket.on('send message', function(name,text){
    var msg = name + ' : ' + text;
    console.log(msg);
    io.emit('receive message', msg);
  });
});

http.listen(3000, function(){
  console.log('User : ' + count);
  console.log(__dirname);
  console.log('server on!');
});
