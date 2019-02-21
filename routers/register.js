const express = require('express');
const router = express.Router();
const db = require('../modules/connector');

router.get('/register',function(req, res){
  res.sendFile(__dirname + '/html/register.html');
});

router.post('/register', function(req, res){
  const email = req.body.email;
  const password = req.body.password;
  const selectSql = 'select * from users where email = ? and password = ?';
  const insertSql = 'insert into table (email, password) values(?, ?)';
  const params = [email, password];

  db.query(selectSql, params, function(err, result){
    if (err) throw err;

    if (result.length !== 0){
      res.send('<script type="text/javascript">alert("이미 사용중인 이메일 주소입니다")</script>');
    }
    else{
      db.query(insertSql, params, function(err, result){
        if (err) throw err;
        res.redirect('/');
      })
    }
  }
});

module.exports = router;
