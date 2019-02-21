//server.js

let count = 0; // user count
let nameDict = {}; //mapping to socket id and name

const express = require('express');
const app = express();
const http = require('http').Server(app);
const bodyParser = require('body-parser')

const io = require('./modules/io.js')(http);

const index = require('./routers/index.js');
const register = require('./routers/register.js');
const chat = require('./routers/chat.js');



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));

app.use('/', index);
app.use('/register', register);
app.use('/chat', chat);

app.use(express.static(__dirname + '/statics/'));



http.listen(3000, function(){
  console.log(__dirname);
  console.log('server on!');
});

module.exports = app;
