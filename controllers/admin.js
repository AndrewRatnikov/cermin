const passport = require('passport');
const User = require('../model/user');

const registerPage = (res, err) => {
  res.render('admin/register', { title: 'Registration', error: err, hasErr: !!err });
}

module.exports.getRegisterPage = function( req, res, next ) {
  let err = req.flash('error');
  registerPage( res, err );
  //res.render('admin/register', { title: 'Registration', error: err, hasErr: !!err });
};

module.exports.registerNewUser = function( req, res, next ) {
  const user = new User();
  user.email = req.body.email;
  user.setPassword(req.body.password);
  user.save(function(err) {
    if (err) return registerPage( res, err );
    req.login(user, function(err) {
      if (err) return registerPage( res, err );
      res.redirect('/');
    });
  });
};
// module.exports.registerNewUser = passport.authenticate('local.register', {
//   failureRedirect: '/admin/register',
//   failureFlash: true
// });

module.exports.getLoginPage = function( req, res, next ) {
  let err = req.flash('error');
  res.render('admin/login', { title: 'Login', error: err, hasErr: !!err });
};

module.exports.loginUser = passport.authenticate('local.login', {
  failureRedirect: '/admin/login',
  failureFlash: true
});
