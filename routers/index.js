const express = require('express');
const router = express.Router();
const db = require('../modules/connector');

router.get('/', function(req, res){
  if (req.session.user === undefined){
    res.sendFile(__dirname + '/html/index.html');
  }
  else {
    res.redirect('/chat');
  }
});

router.post('/', function(req, res){
  const email = req.body.email;
  const password = req.body.password;
  const selectSql = 'select * from users where email = ? and password = ?';
  const params = [email, password];

  db.query(selectSql, params, function(err, result){
    if (err) throw err;
    if (result.length === 0){
      res.send('<script type="text/javascript">alert("로그인 실패");window.location.href = "/";</script>');
    }
    else{
      req.session.user ={
        id: email,
        pw: password,
        name: 'LOL',
        authorized: true
      };
      res.redirect('/chat');
    }
  });
});

module.exports = router;
