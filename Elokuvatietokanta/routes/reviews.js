const express = require('express');
const router = express.Router();
const db = require('../db');

// TALLENNA (POST /api/reviews/save)
router.post('/save', (req, res) => {
    const userId = req.session.userId;
    if (!userId) return res.status(401).json({ error: "Kirjaudu sisään" });

    const { title, img_url, category, genre, watch_date, thoughts, best_scene, quote, drop, fire, score } = req.body;

    const sql = `INSERT INTO reviews 
        (user_id, title, img_url, category, genre, watch_date, thoughts, best_scene, quote, drop_rating, fire_rating, score) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const values = [userId, title, img_url, category, genre, watch_date, thoughts, best_scene, quote, drop, fire, score];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error("Tietokantavirhe:", err);
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: "Arvostelu tallennettu!", id: result.insertId });
    });
});

// HAE KAIKKI (GET /api/reviews/all)
router.get('/all', (req, res) => {
    const userId = req.session.userId;
    db.query("SELECT * FROM reviews WHERE user_id = ? ORDER BY created_at DESC", [userId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

module.exports = router;