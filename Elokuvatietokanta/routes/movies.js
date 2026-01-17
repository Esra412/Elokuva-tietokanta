const express = require('express');
const router = express.Router();
const db = require('../db'); // Varmista, että polku on oikein

// ⭐ LISÄÄ ELOKUVA (POST /api/movies/add)
router.post('/add', (req, res) => {
    const { imdbId, type, title, poster } = req.body;
    const userId = req.session.userId;

    if (!userId) return res.status(401).json({ error: "Kirjaudu sisään" });

    const sql = "INSERT INTO user_movies (user_id, imdb_id, title, poster, type, status) VALUES (?, ?, ?, ?, ?, 'watchlist')";
    db.query(sql, [userId, imdbId, title, poster, type], (err, result) => {
        if (err) {
            console.error("SQL Virhe:", err);
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ message: "Lisätty!" });
    });
});

// 📥 HAE LISTA (GET /api/movies/list)
router.get('/list', (req, res) => {
    const userId = req.session.userId;
    if (!userId) return res.status(401).json({ error: "Kirjaudu sisään" });

    const sql = "SELECT * FROM user_movies WHERE user_id = ?";
    db.query(sql, [userId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// 🗑️ POISTA (DELETE /api/movies/remove/:id)
router.delete('/remove/:id', (req, res) => {
    const movieId = req.params.id;
    const sql = "DELETE FROM user_movies WHERE id = ?";
    db.query(sql, [movieId], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Poistettu" });
    });
});

module.exports = router;