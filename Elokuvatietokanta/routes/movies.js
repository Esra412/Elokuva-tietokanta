const express = require('express');
const db = require('../db');
const router = express.Router();

/* 🔍 ARAMA */
router.get('/search', (req, res) => {
    const q = `%${req.query.q}%`;

    db.query(
        "SELECT * FROM movies WHERE title LIKE ?",
        [q],
        (err, results) => {
            res.json(results);
        }
    );
});

/* ➕ KULLANICIYA EKLE */
router.post('/add', (req, res) => {
    const userId = req.session.userId;
    const { imdbId, title, type } = req.body;

    db.query(
        `INSERT INTO user_movies (user_id, imdb_id, title, type)
         VALUES (?, ?, ?, ?)`,
        [userId, imdbId, title, type],
        () => res.json({ message: 'Listeye eklendi' })
    );
});


/* 📄 KULLANICININ LİSTESİ */
router.get('/my', (req, res) => {
    const userId = req.session.userId;

    db.query(
        "SELECT * FROM user_movies WHERE user_id = ?",
        [userId],
        (err, result) => res.json(result)
    );
});



let myMovies = [];

router.post('/add', (req, res) => {
    const { imdbId, type, title } = req.body;
    myMovies.push({ imdbId, type, title });
    res.json({ success: true });
});

router.get('/list', (req, res) => {
    res.json(myMovies);
});

module.exports = router;


module.exports = router;
