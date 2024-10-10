const LocalStrategy = require('passport-local').Strategy;
const User = require('../../models').User;
const db = require('../../models');
const Op = db.Sequelize.Op;

module.exports = new LocalStrategy(async (username, password, done) => {
  const user = await User.findOne({
    where: {
      email: username,
      active: true,
    },
  });
  if (user === null) {
    return done(null, false);
  }
  if (!user.validPassword(password)) {
    return done(null, false);
  }
  return done(null, user);
});
