const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'elokuvatietokanta'
});

db.connect(err => {
    if (err) {
        console.error('Tietokantavirhe:', err);
    } else {
        console.log('Tietokanta yhdistetty');
    }
});

module.exports = db;
