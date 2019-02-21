const express = require('express');
const router = express.Router();
const db = require('../modules/connector');

router.get('/', function(req, res){
  res.sendFile(__dirname + '/html/index.html');
});

router.post('/', function(req, res){
  const email = req.body.email;
  const password = req.body.password;
  const selectSql = 'select * from users where email = ? and password = ?';
  const params = [email, password];

  db.query(selectSql, params, function(err, result){
    if (err) throw err;

    if (result.length === 0){
      res.send('<script type="text/javascript">alert("존재하지 않는 이메일 주소입니다");window.location.href = "/";</script>');
    }
    else{
      res.redirect('/chat');
    }
  });
});

module.exports = router;
