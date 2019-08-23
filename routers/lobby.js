//lobby.js

const express = require('express');
const router = express.Router();

router.get('/', function(req, res){
  if (req.session.user === undefined){
    return res.redirect('/');
  }
  else{
    return res.sendFile(__dirname + '/html/lobby.html');
  }
});

module.exports = router;
