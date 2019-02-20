const db = require('./connector');

console.log(db.query('select * from users'));
