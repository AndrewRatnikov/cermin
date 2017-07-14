module.exports.getIndexPage = function ( req, res, next ) {
  res.render('index', { title: 'Express', name: req.user.email });
};
