var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var User = mongoose.model('User');

passport.use('local.login', new LocalStrategy(/*{
  usernameField: 'name',
  passwordField: 'password',
  passReqToCallback: true
}, */function( username, password, done ) {
  console.log(username, password);
  User.findOne({ name: username }, function(err, user) {
    if (err) {
      return done(err);
    }
    if (!user) {
      return done(null, false, { message: "Incorrect username" });
    }
    if (!user.validPassword(password)) {
      return done(null, false, { message: "Incorrect password" });
    }
    return done(null, user);
  });
}));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});
