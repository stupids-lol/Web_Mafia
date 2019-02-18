// server.js

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/',function(req, res){
  res.sendFile(__dirname + '/client.html');
});

var count=0;


io.on('connection', function(socket){
  count++;
  console.log('user connected: ', socket.id);
  console.log('User : ' + count);
  var name = "user";

  socket.on('disconnect', function(){
    count--;
    console.log('user disconnected: ', socket.id);
    console.log('User : ' + count);
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
