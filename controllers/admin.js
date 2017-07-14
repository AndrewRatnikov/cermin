const passport = require('passport');
const User = require('../model/user');

const registerPage = (res, err) => {
  res.render('admin/register', { title: 'Registration', error: err, hasErr: !!err });
}

const delUser = (res, err, success) => {
  res.render('admin/deluser', { title: 'Delete user', error: err, hasErr: !!err, success: success, hasSuccess: !!success });
};

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

module.exports.logout = function( req, res, next ) {
  req.logout();
  res.redirect('/');
};

module.exports.getDelPage = function ( req, res, next ) {
  delUser(res, null);
};

module.exports.deleteUser = function ( req, res, next ) {
  if ( !req.body.email ) return delUser(res, 'Email is empty');
  User.findOneAndRemove({ 'email': req.body.email }, function(err, doc, result) {
    return doc ? delUser( res, null, `${req.body.email} was deleted` ) : delUser( res, 'Email does not exist' );
  });
};
