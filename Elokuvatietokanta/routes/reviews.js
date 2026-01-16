const express = require('express');
const router = express.Router();
const db = require('../db');

// TALLENNA TAI PÄIVITÄ (POST /api/reviews/save)
router.post('/save', (req, res) => {
    const userId = req.session.userId;
    if (!userId) return res.status(401).json({ error: "Kirjaudu sisään" });

    const { id, title, img_url, category, genre, watch_date, thoughts, best_scene, quote, drop, fire, score } = req.body;

    if (id) {
        // GÜNCELLEME (UPDATE)
        const sql = `UPDATE reviews SET 
            title=?, img_url=?, genre=?, watch_date=?, thoughts=?, 
            best_scene=?, quote=?, drop_rating=?, fire_rating=?, score=? 
            WHERE id=? AND user_id=?`;
        
        const values = [title, img_url, genre, watch_date, thoughts, best_scene, quote, drop, fire, score, id, userId];

        db.query(sql, values, (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "Arvostelu päivitetty!" });
        });
    } else {
        // YENİ KAYIT (INSERT)
        const sql = `INSERT INTO reviews 
            (user_id, title, img_url, category, genre, watch_date, thoughts, best_scene, quote, drop_rating, fire_rating, score) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        const values = [userId, title, img_url, category || 'Elokuva', genre, watch_date, thoughts, best_scene, quote, drop, fire, score];

        db.query(sql, values, (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "Arvostelu tallennettu!", id: result.insertId });
        });
    }
});

// HAE KAIKKI (GET /api/reviews/all)
router.get('/all', (req, res) => {
    const userId = req.session.userId;
    db.query("SELECT * FROM reviews WHERE user_id = ? ORDER BY created_at DESC", [userId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// HAE YKSI (GET /api/reviews/:id)
router.get('/:id', (req, res) => {
    const userId = req.session.userId;
    db.query("SELECT * FROM reviews WHERE id = ? AND user_id = ?", [req.params.id, userId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results[0]);
    });
});

// POISTA (DELETE /api/reviews/:id)
router.delete('/:id', (req, res) => {
    const userId = req.session.userId;
    db.query("DELETE FROM reviews WHERE id = ? AND user_id = ?", [req.params.id, userId], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Poistettu!" });
    });
});

module.exports = router;