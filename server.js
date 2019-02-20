//server.js
let count = 0; // user count
let nameDict = {}; //mapping to socket id and name

const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('./io.js')(http);
const root = require('./routers/root')

app.use('/', root)
app.use(express.static(__dirname + '/statics/'));

http.listen(3000, function(){
  console.log(count + ' people are chatting.');
  console.log(__dirname);
  console.log('server on!');
});

module.exports = app;
