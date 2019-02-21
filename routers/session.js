const express = require('express');
const http = require('http');
const path = require('path');
const expressSession = require('express-session');

const router = express.Router();

router.route('s/chat').get(
    function (req, res)
    {
        console.log('/chat  라우팅 함수 실행');

        if (req.session.user)
        {
            res.redirect('s/chat.html');
        }
        else
        {
            res.redirect('s/index.html');

        }
    }
);

router.route('s/index').post(
    function (req, res) {
        console.log('index 라우팅 함수호출 됨');

        var paramID = req.body.id || req.query.id;
        var pw = req.body.passwords || req.query.passwords;

        if (req.session.user) {
            console.log('이미 로그인 되어 있음');

            res.writeHead(200, { "Content-Type": "text/html;characterset=utf8" });
            res.write('<h1>already Login</h1>');
            res.write('[ID] : ' + paramID + ' [PW] : ' + pw);
            res.write('<a href="s/chat">Move</a>');
            res.end();

        } else {
            req.session.user =
                {
                    id: paramID,
                    pw: pw,
                    name: 'UsersNames!!!!!',
                    authorized: true
                };
            res.writeHead(200, { "Content-Type": "text/html;characterset=utf8" });
            res.write('<h1>Login Success</h1>');
            res.write('[ID] : ' + paramID + ' [PW] : ' + pw);
            res.write('<a href="s/index">Move</a>');
            res.end();
        }
    }
);

module.exports = router;
