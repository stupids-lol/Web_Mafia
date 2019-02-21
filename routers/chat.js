const express = require('express');
const router = express.Router();

router.get('/', function(req, res){
  console.log('/chat  라우팅 함수 실행');

  if (req.session.user){
    res.sendFile(__dirname + '/html/chat.html');
  }
  else{
    res.redirect('/');

  }
});

module.exports = router;
