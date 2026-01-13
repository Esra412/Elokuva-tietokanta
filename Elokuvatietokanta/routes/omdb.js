const express = require('express');
const fetch = require('node-fetch');
const router = express.Router();

router.get('/search', async (req, res) => {
    try {
        const q = req.query.q;
        const apiKey = process.env.OMDB_API_KEY;

        const url = `https://www.omdbapi.com/?apikey=${apiKey}&s=${q}`;
        const response = await fetch(url);
        const data = await response.json();

        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'OMDb error' });
    }
});

module.exports = router;
