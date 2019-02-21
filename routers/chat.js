const express = require('express');
const router = express.Router();

router.get('/chat', function(req, res){
  res.sendFile(__dirname + '/html/chat.html');
});

module.exports = router;
