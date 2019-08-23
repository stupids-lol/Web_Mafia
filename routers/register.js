//register.js

const express = require('express');
const router = express.Router();
const db = require('../modules/connector');
const crypto = require('crypto');

router.get('/',function(req, res){
  return res.sendFile(__dirname + '/html/register.html');
});

router.post('/', function(req, res){
  const email = req.body.email;
  if(req.body.password !== req.body.passwordcheck){
    return res.send('<script type="text/javascript">alert("비밀번호가 일치하지 않습니다");window.location.href = "/register"</script>');
  }
  const password = crypto.createHash('sha512').update(crypto.createHash('sha512').update(req.body.password).digest('base64')).digest('base64');
  const name = req.body.name;
  const selectSql = 'select * from users where email = ?';
  const insertSql = 'insert into users (email, password, name) values(?, ?, ?)';
  const insertParams = [email, password, name];

  db.query(selectSql, [email], function(err, result){
    if (err) throw err;

    if (result.length !== 0){
      return res.send('<script type="text/javascript">alert("이미 사용중인 이메일 주소입니다");window.location.href = "/register"</script>');
    }
    else{
      db.query(insertSql, insertParams, function(err, result){
        if (err) throw err;
        return res.redirect('/');
      })
    }
  });
});

module.exports = router;
