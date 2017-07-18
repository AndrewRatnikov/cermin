module.exports.getIndexPage = function ( req, res, next ) {
  const email = req.user ? req.user.email : 'Noname';
  const id = req.session.passport.user;
  res.render('index', { title: 'Express', name: email, isLogged: req.isAuthenticated(), id: id });
};
