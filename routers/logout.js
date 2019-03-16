//logout.js

const express = require('express');
const router = express.Router();
const db = require('../modules/connector');

router.get('/', function(req, res){
  db.query('update users set status=0 where email=', req.session.user.id, function(err, result){
    if (err) throw err;
  });
  req.session.destroy();
  res.redirect('/')
});

module.exports = router;
