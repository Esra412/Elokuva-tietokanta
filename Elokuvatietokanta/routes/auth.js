const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../db');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

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


// 1. Pyyntö salasanan palauttamisesta
router.post('/forgot-password', (req, res) => {
    const { email } = req.body;
    const token = crypto.randomBytes(20).toString('hex'); // Luodaan uniikki koodi
    const expires = new Date(Date.now() + 3600000); // Voimassa 1 tunnin

    const sql = `UPDATE users SET reset_token = ?, token_expires = ? WHERE email = ?`;
    
    db.query(sql, [token, expires, email], (err, result) => {
        if (err || result.affectedRows === 0) {
            return res.status(404).json({ message: 'Sähköpostia ei löytynyt' });
        }

        // Sähköpostin asetukset (Käytä esim. Gmailia tai Mailtrapia testaukseen)
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'Esra070bagdat@gmail.com',
                pass: 'sowugphhjhlpmfdh'
            }
        });

        const mailOptions = {
            from: 'Elokuvatietokanta <no-reply@movie.com>',
            to: email,
            subject: 'Salasanan palautus',
            text: `Palauta salasanasi klikkaamalla linkkiä: http://localhost:3001/reset-password/${token}`
        };

        transporter.sendMail(mailOptions, (error) => {
            if (error) return res.status(500).json({ message: 'Virhe sähköpostin lähetyksessä' });
            res.json({ message: 'Palautuslinkki lähetetty sähköpostiin' });
        });
    });
});

// 2. Uuden salasanan tallentaminen
router.post('/reset-password/:token', async (req, res) => {
    const { password } = req.body;
    const { token } = req.params;
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = `
        UPDATE users 
        SET password = ?, reset_token = NULL, token_expires = NULL 
        WHERE reset_token = ? AND token_expires > NOW()
    `;

    db.query(sql, [hashedPassword, token], (err, result) => {
        if (err || result.affectedRows === 0) {
            return res.status(400).json({ message: 'Linkki on vanhentunut tai virheellinen' });
        }
        res.json({ message: 'Salasana vaihdettu onnistuneesti' });
    });
});


/*ULOSKIRJAUTUMINEN */
router.post('/logout', (req, res) => {
    req.session.destroy();
    res.json({ message: 'Kirjauduttu ulos' });
});



module.exports = router;



