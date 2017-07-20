const Post = require('../model/blogpost');

module.exports.getIndexPage = function ( req, res, next ) {
  const err = req.flash('error');
  const id = req.user && req.user._id;
  const email = req.user ? req.user.email : 'Noname';
  Post.find({}, function(err, posts) {
    if (err) {
      req.flash('error', err);
      return res.redirect('back');
    }
    return res.render('index', {
      title: 'Express',
      name: email,
      error: err,
      hasErr: !!err,
      posts: posts,
      isLogged: req.isAuthenticated(),
      id: id
    });
  });
};
