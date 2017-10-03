const passport = require('passport');

const User = require('../model/user');

const registerPage = (req, res, err, success) => {
    res.render('admin/form', {
        title: 'Registration',
        error: err,
        hasErr: !!err.length,
        success: success,
        hasSuccess: !!success,
        needPassword: true,
        id: req.user._id,
        email: req.user.email,
        isLogged: req.isAuthenticated()
    });
};

const delUser = (req, res, err, success) => {
    res.render('admin/form', {
        title: 'Delete user',
        error: err,
        hasErr: !!err,
        success: success,
        hasSuccess: !!success,
        id: req.user._id,
        email: req.user.email,
        isLogged: req.isAuthenticated()
    });
};

module.exports.isLogged = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.redirect('login');
    }
};

module.exports.getRegisterPage = function (req, res, next) {
    let err = req.flash('error');
    registerPage(req, res, err);
};

module.exports.registerNewUser = function (req, res, next) {
    const user = new User();
    user.email = req.body.email;
    user.setPassword(req.body.password);
    user.save(function (err) {
        if (err) return registerPage(req, res, err.message);
        return registerPage(req, res, '', 'Successfully register new user');
    });
};
// module.exports.registerNewUser = passport.authenticate('local.register', {
//   failureRedirect: '/admin/register',
//   failureFlash: true
// });

module.exports.getLoginPage = function (req, res, next) {
    let err = req.flash('error');
    if (req.isAuthenticated()) res.redirect(`/admin/profile/${req.user._id}/posts`);
    res.render('admin/form', {
        title: 'Login',
        error: err,
        hasErr: !!err.length,
        success: null,
        hasSuccess: false,
        needPassword: true,
        isLogged: req.isAuthenticated()
    });
};

module.exports.loginUser = passport.authenticate('local.login', {
    failureRedirect: '/admin/login',
    failureFlash: true
});

module.exports.logout = function (req, res, next) {
    req.logout();
    res.redirect('/');
};

module.exports.getDelPage = function (req, res, next) {
    delUser(req, res, null);
};

module.exports.deleteUser = function (req, res, next) {
    if (!req.body.email) return delUser(req, res, 'Email is empty');
    User.findOneAndRemove({'email': req.body.email}, function (err, doc, result) {
        return doc ? delUser(req, res, null, `${req.body.email} was deleted`) : delUser(req, res, 'Email does not exist');
    });
};
