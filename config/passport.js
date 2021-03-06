const passport = require('passport');
const User = require('../model/user');
const LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

// passport.use('local.register', new LocalStrategy( {
//   usernameField: 'email',
//   passwordField: 'password',
//   passReqToCallBack: true
// }, function( email, password, done ) {
//
//   if (!email || !password) return done( null, false, {message: 'All fields are required'} );
//
//   User.findOne({ 'email': email }, function(err, user) {
//     if (err) {
//       return done(err);
//     }
//     if (user) {
//       return done(null, false, {message: 'Email is already in use'} );
//     }
//     var newUser = new User();
//     newUser.email = email;
//     newUser.setPassword(password);
//     newUser.save(function(err, result) {
//       if (err) {
//         return done(err);
//       }
//       return done(null, newUser);
//     });
//   });
//
// } ));

passport.use('local.login', new LocalStrategy( {
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallBack: true
}, function( email, password, done ) {

  if (!email || !password) return done( null, false, {message: 'All fields are required'} );

  User.findOne({ 'email': email }, function(err, user) {
    if (err) {
      return done(err);
    }
    if (user) {
      return user.validPassword(password) ? done(null, user) : done(null, false, { message: 'Password invalid' });
    } else {
      return done(null, false, {message: 'Email does not exist'} );
    }
  });

} ));
