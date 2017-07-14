const passport = require('passport');

module.exports.getRegisterPage = function( req, res, next ) {
  var err = req.flash('error');
  res.render('admin/register', { title: 'Registration', error: err, hasErr: !!err });
};

module.exports.registerNewUser = passport.authenticate('local.register', {
  failureRedirect: '/admin/register',
  failureFlash: true
});

module.exports.getLoginPage = function( req, res, next ) {
  var err = req.flash('error');
  res.render('admin/login', { title: 'Login', error: err, hasErr: !!err });
};

module.exports.loginUser = passport.authenticate('local.login', {
  failureRedirect: '/admin/login',
  failureFlash: true
});
