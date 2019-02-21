const express = require('express');
const router = express.Router();

router.get('/chat', function(req, res){
  res.sendFile('./html/chat.html');
});

module.exports = router;
