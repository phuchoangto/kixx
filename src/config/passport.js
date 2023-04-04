const { Strategy: LocalStrategy } = require('passport-local');
const bcrypt = require('bcrypt');
const passport = require('passport');
const db = require('./db');

// Configure passport to use the local strategy
passport.use(
  new LocalStrategy(
    {
      usernameField: 'username',
      passwordField: 'password',
    },
    async (username, password, done) => {
      try {
        const user = await db.user.findUnique({
          where: {
            username,
          },
        });

        if (!user) {
          return done(null, false, { message: 'Incorrect username.' });
        }

        const valid = await bcrypt.compare(password, user.password);

        if (!valid) {
          return done(null, false, { message: 'Incorrect password.' });
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    },
  ),
);

// Serialize the user id to push into the session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize the user object based on a pre-serialized token
// which is the user id
passport.deserializeUser(async (id, done) => {
  try {
    const user = await db.user.findUnique({
      where: {
        id,
      },
    });

    return done(null, user);
  } catch (err) {
    return done(err);
  }
});

module.exports = passport;
