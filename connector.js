const mysql = require('mysql');
const db = {
  host: '13.209.19.95',
  port: 13131,
  user: 'root',
  password: 'sunrin',
  database: 'webmafia'
};

var connector
function handleDisconnect(){
  connector = mysql.createConnection(db);

  connection.connect(function(err){
    if(err){
      console.log('ConnectingError : ', err);
      setTimeout(handleDisconnect, 2000);
    }
  });

  connection.on('error', function(err){
    console.log('DBError : ', err);
    if(err.code === 'PROTOCOL_CONNECTION_LOST'){
      handleDisconnect();
    }
    else{
      throw err;
    }
  });
}

handleDisconnect();

module.exports = connector;
