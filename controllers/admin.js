const passport = require('passport');

module.exports.getRegisterPage = function( req, res, next ) {
  var err = req.flash('error');
  console.log(err);
  res.render('admin/register', { title: 'Registration', error: err, hasErr: !!err });
};

module.exports.registerNewUser = passport.authenticate('local.register', {
  failureRedirect: '/admin/register',
  failureFlash: true
});
