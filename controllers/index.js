module.exports.getIndexPage = function ( req, res, next ) {
  const email = req.user ? req.user.email : 'Noname';
  res.render('index', { title: 'Express', name: email, isLogged: req.isAuthenticated() });
};
