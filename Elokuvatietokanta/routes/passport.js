const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const db = require('../db');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback"
}, (accessToken, refreshToken, profile, done) => {

    const email = profile.emails[0].value;
    const username = profile.displayName;

    db.query(
        "SELECT * FROM users WHERE email = ?",
        [email],
        (err, result) => {
            if (result.length > 0) {
                return done(null, result[0]);
            } else {
                db.query(
                    "INSERT INTO users (username, email, password) VALUES (?, ?, '')",
                    [username, email],
                    (err, res) => {
                        return done(null, {
                            id: res.insertId,
                            username
                        });
                    }
                );
            }
        }
    );
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    db.query("SELECT * FROM users WHERE id = ?", [id], (err, result) => {
        done(null, result[0]);
    });
});
