require('dotenv').config();
console.log("OMDb KEY:", process.env.OMDB_API_KEY);

const express = require('express');
const session = require('express-session');
const path = require('path');

const authRoutes = require('./routes/auth');
const movieRoutes = require('./routes/movies');
const omdbRoutes = require('./routes/omdb');


const app = express(); // ✅ ÖNCE app
const PORT = 3001;

// JSON & FORM
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// SESSION
app.use(session({
    secret: 'salainen_avain_123',
    resave: false,
    saveUninitialized: false
}));

// 🔐 LOGIN KONTROLÜ
function requireLogin(req, res, next) {
    if (!req.session.userId) {
        return res.redirect('/login');
    }
    next();
}

app.use('/api/omdb', omdbRoutes);

// ROUTES
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);

// STATIC
app.use(express.static(path.join(__dirname, 'public')));

// VIEWS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// PAGES
app.get('/', (req, res) => {
    res.render('pages/index');
});

app.get('/login', (req, res) => {
    res.render('pages/login');
});

app.get('/dashboard', requireLogin, (req, res) => {
    // Render ederken ikinci parametre olarak veriyi gönderiyoruz
    res.render('pages/dashboard', { 
        username: req.session.username || 'Käyttäjä'
    });
});

app.get('/movies', requireLogin, (req, res) => {
    res.render('pages/movies');
});


// SERVER
app.listen(PORT, () => {
    console.log(`Server running: http://localhost:${PORT}`);
});
