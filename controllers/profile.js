const fs = require('fs');
const crypto = require('crypto');

const User = require('../model/user');
const Post = require('../model/blogpost');

module.exports.getUserPage = function (req, res, next) {
    let error = req.flash('error');
    User.findOne({'_id': req.params.id}, function (err, user) {
        if (err) {
            req.flash('error', err);
            res.redirect('/admin/login');
        } else {
            Post.find({}, function(err, posts) {
                if (err) {
                    req.flash('error', err);
                    res.redirect('/admin/login');
                } else {
                    posts = posts.map((post) => {
                        const date = `${post.date.getDate()}.${post.date.getMonth()}.${post.date.getFullYear()}`;
                        return {
                            photoUrl: post.photoUrl,
                            title: post.title,
                            description: post.description,
                            author: post.author,
                            label: post.label,
                            date: date
                        };
                    });
                    res.render('admin/user', {
                        posts: posts.reverse(),
                        title: 'Profile',
                        email: user.email,
                        id: user._id,
                        name: user.name,
                        error: error,
                        hasErr: !!error.length,
                        urlAvatar: user.urlAvatar,
                        isLogged: req.isAuthenticated()
                    });
                }
            });
        }
    });
};

const createHash = (name) => {
    const fileExtension = name.slice( name.lastIndexOf('.') );
    const fileName = name.slice(0, fileExtension.length - 1);
    const date = Date.now().toString();
    const hash = crypto.createHash('sha1').update(date).digest('hex');
    return `${fileName}.${hash}${fileExtension}`;
};

const writePostImg = (file) => new Promise(function (resolve, reject) {
    const name = createHash(file.originalFilename);
    const newPath = process.cwd() + "/public/uploads/" + name;
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
    post.date = new Date();
    post.save(function (err, post) {
        if (err) errHandler(req, res, err);
        console.log(post);
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

module.exports.delPost = function (req, res, next) {
    const postId = req.params.postid;
    Post.findOneAndRemove({ '_id': postId }, function(err, doc, post) {
        if (err) return errHandler(req, res, err);
        if (doc) {
            doc.photoUrl.forEach( url => {
                const urlPath = `${process.cwd()}/public/${url}`;
                fs.open(urlPath, 'r', (err, fd) => {
                    if (err) return;
                    fs.unlink(urlPath);
                });
            });
        }
        return res.redirect('back');
    });
};

const jsonResponse = (res, code, response) => {
    res.status(code).json(response);
};

module.exports.uploadAvatar = function (req, res, next) {
    const id = req.params.id;
    if (Object.keys(req.files).length === 0) return jsonResponse(res, 404, { error: 'No files were upload.' });
    if (!req.files.uploadAvatar.type.match(/^image/)) return jsonResponse(res, 404, { error: 'Files must be images.' });
    fs.readFile(req.files.uploadAvatar.path, function (err, data) {
        const name = createHash(req.files.uploadAvatar.originalFilename);
        const newPath = process.cwd() + "/public/uploads/" + name;
        fs.writeFile(newPath, data, function (err) {
            if (err)  return jsonResponse(res, 404, err);
            User.findById(id).select('urlAvatar').exec(function (err, user) {
                if (err) {
                    return jsonResponse(res, 404, err);
                } else {
                    const oldPath = process.cwd() + "/public/" + user.urlAvatar;
                    fs.unlink(oldPath);
                    user.urlAvatar = "/uploads/" + name;
                    user.save(function (err, user) {
                        if (err) return jsonResponse(res, 404, err);
                        jsonResponse(res, 201, { success: true });
                    });
                }
            });
        });
    });
};