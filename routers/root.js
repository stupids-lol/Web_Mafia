const express = require('express');
const router = express.Router();
const http = require('http').Server(express());
const io = require('socket.io')(http);

router.get('/',function(req, res){
  res.sendFile(__dirname + '/html/client.html');
});

module.exports = router;
