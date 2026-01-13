const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../db');

const router = express.Router();

/* REKISTERÖINTI */
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = `
        INSERT INTO users (username, email, password)
        VALUES (?, ?, ?)
    `;

    db.query(sql, [username, email, hashedPassword], (err) => {
        if (err) {
            return res.status(500).json({ message: 'Käyttäjä on jo olemassa' });
        }
        res.json({ message: 'Rekisteröinti onnistui' });
    });
});

/*KIRJAUTUMINEN */
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    const sql = `SELECT * FROM users WHERE email = ?`;

    db.query(sql, [email], async (err, result) => {
        if (err || result.length === 0) {
            return res.status(401).json({ message: 'Virheellinen kirjautuminen' });
        }

        const user = result[0];
        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            return res.status(401).json({ message: 'Väärä salasana' });
        }

        req.session.userId = user.id;
req.session.username = user.username; // Bunu ekle!

        res.json({ message: 'Kirjautuminen onnistui' });
    });
});

/*ULOSKIRJAUTUMINEN */
router.post('/logout', (req, res) => {
    req.session.destroy();
    res.json({ message: 'Kirjauduttu ulos' });
});



module.exports = router;
