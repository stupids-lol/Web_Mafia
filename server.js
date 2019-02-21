//server.js

let count = 0; // user count
let nameDict = {}; //mapping to socket id and name

const express = require('express');
const app = express();
const http = require('http').Server(app);
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');

const session = expressSession({
  secret: 'my key',
  resave: true,
  saveUninitialized:true
});
app.use(session);
const io = require('./modules/io.js')(http, session);

const index = require('./routers/index.js');
const register = require('./routers/register.js');
const chat = require('./routers/chat.js');


app.use(express.static(__dirname + '/'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));

app.use(cookieParser());

app.use('/', index);
app.use('/register', register);
app.use('/chat', chat);

app.all('*',
    function (req, res) {
        res.status(404).send('<h1> 요청 페이지 없음 </h1>');
    }
);



http.listen(3000, function(){
  console.log(__dirname);
  console.log('server on!');
});

module.exports = app;
