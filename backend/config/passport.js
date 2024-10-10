const passport = require('passport');
const bearer = require('./strategies/bearer');
const local = require('./strategies/local');

passport.use(bearer);
passport.use(local);

module.exports = passport;
