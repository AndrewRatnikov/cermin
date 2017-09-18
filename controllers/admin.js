const fs = require('fs');
const passport = require('passport');

const User = require('../model/user');
const Post = require('../model/blogpost');

const registerPage = (req, res, err) => {
    res.render('admin/register', {title: 'Registration', error: err, hasErr: !!err, isLogged: req.isAuthenticated()});
};

const delUser = (req, res, err, success) => {
    res.render('admin/deluser', {
        title: 'Delete user',
        error: err,
        hasErr: !!err,
        success: success,
        hasSuccess: !!success,
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
    //res.render('admin/register', { title: 'Registration', error: err, hasErr: !!err });
};

module.exports.registerNewUser = function (req, res, next) {
    const user = new User();
    user.email = req.body.email;
    user.setPassword(req.body.password);
    user.save(function (err) {
        if (err) return registerPage(res, err);
        req.login(user, function (err) {
            if (err) return registerPage(res, err);
            res.redirect('/');
        });
    });
};
// module.exports.registerNewUser = passport.authenticate('local.register', {
//   failureRedirect: '/admin/register',
//   failureFlash: true
// });

module.exports.getLoginPage = function (req, res, next) {
    let err = req.flash('error');
    res.render('admin/login', {title: 'Login', error: err, hasErr: !!err, isLogged: req.isAuthenticated()});
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
    if (!req.body.email) return delUser(res, 'Email is empty');
    User.findOneAndRemove({'email': req.body.email}, function (err, doc, result) {
        return doc ? delUser(res, null, `${req.body.email} was deleted`) : delUser(res, 'Email does not exist');
    });
};

module.exports.getUserPage = function (req, res, next) {
    let error = req.flash('error');
    User.findOne({'_id': req.params.id}, function (err, user) {
        if (err) {
            req.flash('error', err);
            res.redirect('/admin/login');
        } else {
            res.render('admin/user', {
                title: 'Profile',
                email: user.email,
                id: user._id,
                error: error,
                hasErr: !!error,
                urlAvatar: user.urlAvatar,
                isLogged: req.isAuthenticated()
            });
        }
    });
};

const writePostImg = (file) => new Promise(function (resolve, reject) {
    let name = file.originalFilename;
    let newPath = process.cwd() + "/public/uploads/" + name;
    fs.readFile(file.path, (err, data) => {
        if (err) {
            reject('Can not read file');
        }
        fs.writeFile(newPath, data, (err) => {
            if (err) {
                reject('Upload error');
            }
            resolve("/uploads/" + name);
        });
    });
});

const errHandler = (req, res, err) => {
    req.flash('error', err);
    return res.redirect('back');
};

const savePost = (req, res, url) => {
    const post = new Post();
    post.title = req.body.title;
    post.label = req.body.label;
    post.description = req.body.text;
    post.photoUrl = url;
    post.author = req.params.id;
    post.save(function (err, post) {
        if (err) {
            errHandler(req, res, err);
        }
        res.redirect('back');
    });
};

module.exports.addPost = function (req, res, next) {
    if (!req.files) return errHandler(req, res, 'No files were uploaded.');
    const file = req.files.uploadPostPreview;
    if (file.path) {
        if (!file.type.match(/^image/)) return errHandler(req, res, 'Files must be images.');
        writePostImg(file)
            .then( results => savePost(req, res, results) )
            .catch( err => errHandler(req, res, err) );
    } else {
        let isImages = true;
        file.forEach(f => {
            if (!f.type.match(/^image/)) isImages = false;
        });
        if (!isImages) return errHandler(req, res, 'Files must be images.');
        Promise.all( file.map(writePostImg) )
            .then( results => savePost(req, res, results) )
            .catch( err => errHandler(req, res, err) );
    }
};

module.exports.uploadAvatar = function (req, res, next) {
    const id = req.params.id;
    fs.readFile(req.files.uploadAvatar.path, function (err, data) {
        const name = req.files.uploadAvatar.originalFilename;
        const newPath = process.cwd() + "/public/uploads/" + name;
        fs.writeFile(newPath, data, function (err) {
            if (err) {
                req.flash('error', 'Upload error');
                return res.redirect('back');
            }
            User.findById(id).select('urlAvatar').exec(function (err, user) {
                if (err) {
                    req.flash('error', 'User do not exist');
                    res.redirect('back');
                } else {
                    var oldPath = process.cwd() + "/public/" + user.urlAvatar;
                    fs.unlink(oldPath);
                    user.urlAvatar = "/uploads/" + name;
                    user.save(function (err, user) {
                        if (err) {
                            req.flash('error', err);
                            return res.redirect('back');
                        }
                        res.redirect('back');
                    });
                }
            });
        });
    });
};
