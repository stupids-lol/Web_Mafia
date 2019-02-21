const express = require('express');
const router = express.Router();

router.get('/', function(req, res){
  console.log('/chat  라우팅 함수 실행');

  if (req.session.user === undefined){
    res.redirect('/');
  }
  else{
    res.sendFile(__dirname + '/html/chat.html');
  }
});

module.exports = router;
