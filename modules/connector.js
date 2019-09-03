const mysql = require('mysql');
require('dotenv').config();
const db = {
  host: `${process.env.DB_HOST}`,
  port: 3306,
  user: `${process.env.DB_USER}`,
  password: `${process.env.DB_PASS}`,
  database: `${process.env.DB_NAME}`
};

var connector
function handleDisconnect(){
  connector = mysql.createConnection(db);

  connector.connect(function(err){
    if(err){
      console.log('ConnectingError : ', err);
      setTimeout(handleDisconnect, 2000);
    }
  });

  connector.on('error', function(err){
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
