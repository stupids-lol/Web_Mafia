//register.js

const express = require('express');
const router = express.Router();
const db = require('../modules/connector');

router.get('/',function(req, res){
  res.sendFile(__dirname + '/html/register.html');
});

router.post('/', function(req, res){
  const email = req.body.email;
  const password = req.body.password;
  const name = req.body.name;
  const selectSql = 'select * from users where email = ?';
  const insertSql = 'insert into users (email, password, name) values(?, ?, ?)';
  const insertParams = [email, password, name];

  db.query(selectSql, [email], function(err, result){
    if (err) throw err;

    if (result.length !== 0){
      res.send('<script type="text/javascript">alert("이미 사용중인 이메일 주소입니다")</script>');
    }
    else{
      db.query(insertSql, insertParams, function(err, result){
        if (err) throw err;
        res.redirect('/');
      })
    }
  });
});

module.exports = router;
