const fs = require('fs');
const crypto = require('crypto');

const User = require('../model/user');
const Post = require('../model/blogpost');
const Label = require('../model/label');

const jsonResponse = (res, code, response) => {
    res.status(code).json(response);
};

const addZeroToDate = (num) => {
    return `${num}`.length === 1 ? `0${num}` : `${num}`;
};

module.exports.getPostsPage = function (req, res, next) {
    let error = req.flash('error');
    Post.find({}, function (err, posts) {
        if (err) {
            req.flash('error', err);
            res.redirect('/admin/login');
        } else {
            posts = posts.map((post) => {
                const date = `${addZeroToDate(post.date.getDate())}.${addZeroToDate(post.date.getMonth())}.${post.date.getFullYear()}`;
                return {
                    _id: post._id,
                    photoUrl: post.photoUrl,
                    title: post.title,
                    description: post.description,
                    author: post.author,
                    label: post.label,
                    date: date
                };
            });
            res.render('admin/posts', {
                posts: posts.reverse(),
                title: 'Profile',
                email: req.user.email,
                id: req.user._id,
                name: req.user.name,
                error: error,
                hasErr: !!error.length,
                urlAvatar: req.user.urlAvatar,
                isLogged: req.isAuthenticated()
            });
        }
    });
};

module.exports.getAddPostPage = function (req, res, next) {
    let error = req.flash('error') || '';
    Label.find({}, function (err, labels) {
        res.render('admin/add_post', {
            title: 'Profile',
            email: req.user.email,
            id: req.user._id,
            name: req.user.name,
            urlAvatar: req.user.urlAvatar,
            labels: labels,
            error: error,
            hasErr: !!error.length,
            isLogged: req.isAuthenticated()
        });
    });
};

const createHash = (name) => {
    const fileExtension = name.slice(name.lastIndexOf('.'));
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

const savePost = (req, res, url) => {
    const post = new Post();
    post.title = req.body.title;
    post.label = req.body.label;
    post.description = req.body.text;
    post.photoUrl = url;
    post.author = req.params.id;
    post.date = new Date();
    post.save(function (err, post) {
        if (err) jsonResponse(res, 200, err);
        jsonResponse(res, 200, { success: true, message: 'Post successfully added', post });
    });
};

module.exports.addPost = function (req, res, next) {
    if (!req.files) return jsonResponse(res, 200, {error: 'No files were uploaded.'});
    const file = req.files.uploadPostPreview;
    if (file.path) {
        if (!file.type.match(/^image/)) return jsonResponse(res, 200, {error: 'Files must be images.'});
        writePostImg(file)
            .then(results => savePost(req, res, results))
            .catch(err => jsonResponse(res, 200, err));
    } else {
        let isImages = true;
        file.forEach(f => {
            if (!f.type.match(/^image/)) isImages = false;
        });
        if (!isImages) return jsonResponse(res, 200, {error: 'Files must be images.'});
        Promise.all(file.map(writePostImg))
            .then(results => savePost(req, res, results))
            .catch(err => jsonResponse(res, 200, err));
    }
};

module.exports.delPost = function (req, res, next) {
    const postId = req.params.postid;
    Post.findOneAndRemove({'_id': postId}, function (err, doc, post) {
        if (err) return jsonResponse(res, 200, err);
        if (doc) {
            doc.photoUrl.forEach(url => {
                const urlPath = `${process.cwd()}/public/${url}`;
                fs.open(urlPath, 'r', (err, fd) => {
                    if (err) return;
                    fs.unlink(urlPath);
                });
            });
        }
        return jsonResponse(res, 200, { success: true });
    });
};

module.exports.uploadAvatar = function (req, res, next) {
    const id = req.params.id;
    if (Object.keys(req.files).length === 0) return jsonResponse(res, 200, {error: 'No files were upload.'});
    if (!req.files.uploadAvatar.type.match(/^image/)) return jsonResponse(res, 200, {error: 'Files must be images.'});
    fs.readFile(req.files.uploadAvatar.path, function (err, data) {
        const name = createHash(req.files.uploadAvatar.originalFilename);
        const newPath = process.cwd() + "/public/uploads/" + name;
        fs.writeFile(newPath, data, function (err) {
            if (err) return jsonResponse(res, 200, err);
            User.findById(id).select('urlAvatar').exec(function (err, user) {
                if (err) {
                    return jsonResponse(res, 200, err);
                } else {
                    if (user.urlAvatar) {
                        const oldPath = process.cwd() + "/public/" + user.urlAvatar;
                        fs.unlink(oldPath);
                    }
                    user.urlAvatar = "/uploads/" + name;
                    user.save(function (err, user) {
                        if (err) return jsonResponse(res, 200, err);
                        jsonResponse(res, 200, {success: true});
                    });
                }
            });
        });
    });
};

module.exports.changePersonalData = function (req, res, next) {
    const userId = req.params.id;
    const data = {
        email: req.body.email.trim(),
        name: req.body.name.trim()
    };
    if (!data.email || !data.name) return jsonResponse(res, 200, {error: 'All fields are required'});

    User.findOneAndUpdate({'_id': userId}, data, function (err, doc) {
        if (err) return jsonResponse(res, 200, err);
        return jsonResponse(res, 200, {success: true});
    });
};

module.exports.changePassword = function (req, res, next) {
    const userId = req.params.id;
    const data = {
        oldPas: req.body.oldPassword,
        newPas: req.body.newPassword,
        confirmNewPas: req.body.confirmNewPassword
    };
    if (data.newPas !== data.confirmNewPas) return jsonResponse(res, 200, { error: 'You must confirm your password' });
    User.findOne({ '_id': userId }, function (err, user) {
        if (err) return jsonResponse(res, 200, { error: err });
        if (!user.validPassword(data.oldPas)) return jsonResponse(res, 200, {error: 'Invalid password'});
        user.setPassword(data.newPas);
        user.save((err) => {
            if (err) return jsonResponse(res, 200, { error: err });
            return jsonResponse(res, 200, { success: true })
        });
    });
};

const findLabel = label => new Promise(function(resolve, reject) {
    Label.findOne({ 'label': label }, function (err, lab) {
        if (err) reject(err);
        if (lab) reject('Label is already exist');
        resolve(label);
    });
});

module.exports.updateLabel = function (req, res, next) {
    const label = req.body.label.trim();
    if (!label) return jsonResponse(res, 200, { error: 'Field is empty' });
    if (req.body.new === 'true') {
        findLabel(label)
            .then(label => {
                const newLabel = new Label();
                newLabel.label = label;
                newLabel.save(function(err) {
                    if (err) return jsonResponse(res, 200, { error: err });
                    return jsonResponse(res, 200, { success: true, label: label, added: true });
                });
            })
            .catch(err => jsonResponse(res, 200, { error: err }))
        // const newLabel = new Label();
        // newLabel.label = label;
        // newLabel.save(function(err) {
        //     if (err) return jsonResponse(res, 200, { error: err });
        //     return jsonResponse(res, 200, { success: true, label: label, added: true });
        // });
    } else {
        Label.findOneAndRemove({ 'label': label }, function(err) {
            if (err) return jsonResponse(res, 200, { error: err });
            return jsonResponse(res, 200, { success: true, label: label, added: false })
        });
    }
};