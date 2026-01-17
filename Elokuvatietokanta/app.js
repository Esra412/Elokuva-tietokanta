require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');
const authRoutes = require('./routes/auth');
const omdbRoutes = require('./routes/omdb');
const movieRoutes = require('./routes/movies');  
const reviewRoutes = require('./routes/reviews'); 

const app = express();
const PORT = 3001;

// 1. LOGIN TARKISTUS 
function requireLogin(req, res, next) {
    if (!req.session.userId) {

        if (req.originalUrl.startsWith('/api')) {
            return res.status(401).json({ error: "Sessio vanhentunut. Kirjaudu uudelleen." });
        }
        return res.redirect('/login');
    }
    next();
}

// 2. MIDDLEWARE ASETUKSET
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: 'salainen_avain_123',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 } // 24 saatlik oturum
}));

// 3. VIEW ENGINE AYARLARI
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 4. API ROTalari (Backend İşlemleri)
app.use('/api/auth', authRoutes);
app.use('/api/omdb', requireLogin, omdbRoutes);
app.use('/api/movies', requireLogin, movieRoutes);
app.use('/api/reviews', requireLogin, reviewRoutes);

// 5. SAYFA ROTalari (Frontend Sayfaları)
app.get('/', (req, res) => {
    res.render('pages/index');
});

app.get('/login', (req, res) => {
    res.render('pages/login');
});

app.get('/dashboard', requireLogin, (req, res) => {
    res.render('pages/dashboard', { 
        username: req.session.username || 'Käyttäjä'
    });
});

app.get('/movies', requireLogin, (req, res) => {
    res.render('pages/movies');
});

app.get('/arvostelut', requireLogin, (req, res) => {
    res.render('pages/arvostelut');
});

app.get('/arvostelu', requireLogin, (req, res) => {
    res.render('pages/arvostelu');
});

app.get('/lisatietoa', (req, res) => {
    res.render('pages/lisatietoa');
});

app.get('/reset-password/:token', (req, res) => {
    res.render('pages/reset-password', { token: req.params.token });
});
// 6. SERVER BAŞLATMA
app.listen(PORT, () => {
    console.log(`Server running: http://localhost:${PORT}`);
    console.log("OMDb KEY loaded:", process.env.OMDB_API_KEY ? "YES" : "NO");
});