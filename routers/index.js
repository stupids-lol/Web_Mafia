//index.js

const express = require('express');
const router = express.Router();
const db = require('../modules/connector');
const crypto = require('crypto');

router.get('/', function(req, res){
  if (req.session.user === undefined){
    res.sendFile(__dirname + '/html/index.html');
  }
  else {
    res.redirect('/lobby');
  }
});

router.post('/', function(req, res){
  const email = req.body.email;
  const password = crypto.createHash('sha512').update(crypto.createHash('sha512').update(req.body.password).digest('base64')).digest('base64');
  const selectSql = 'select * from users where email = ? and password = ?';
  const params = [email, password]
  db.query(selectSql, params, function(err, result){
    if (err) throw err;
    if (result.length === 0){
      res.json({result: 'fail'});
    }
    else if (result[0].password === password){
      req.session.user ={
        id: email,
        name: result[0].name,
        room: -1,
        authorized: true
      };
      res.json({result: 'success'});
    }
    else{
      res.json({result: 'fail'});
    }
  });
});


router.get('/logout', function(req, res){
  req.session.destroy();
  res.redirect('/')
});

module.exports = router;
