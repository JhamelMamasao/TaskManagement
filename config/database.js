const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'sql6.freemysqlhosting.net',
  user: 'sql6685090',
  password: '3Bg6I8s1Jc',
  database: 'sql6685090',
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
  } else {
    console.log('Connected to MySQL');
  }
});

module.exports = db;