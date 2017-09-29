const express = require('express');
const router = express.Router();
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart();

const ctrlAdmin = require('../controllers/admin');
const ctrlProfile = require('../controllers/profile');

router.get('/login', ctrlAdmin.getLoginPage);

router.post('/login', ctrlAdmin.loginUser, function (req, res, next) {
    const id = req.session.passport.user;
    res.redirect(`profile/${id}`);
});
// go to register page
router.get('/register', ctrlAdmin.isLogged, ctrlAdmin.getRegisterPage);
// register new user
router.post('/register', ctrlAdmin.isLogged, ctrlAdmin.registerNewUser);
// logout from account
router.get('/logout', ctrlAdmin.logout);
// go to delete user page
router.get('/deluser', ctrlAdmin.isLogged, ctrlAdmin.getDelPage);
// delete user
router.post('/deluser', ctrlAdmin.isLogged, ctrlAdmin.deleteUser);
// go to posts page
router.get('/profile/:id/posts', ctrlAdmin.isLogged, ctrlProfile.getPostsPage);
// go to add posts page
router.get('/profile/:id/addpost', ctrlAdmin.isLogged, ctrlProfile.getAddPostPage);
// get new post
router.post('/profile/:id/addpost', ctrlAdmin.isLogged, multipartMiddleware, ctrlProfile.addPost);
// add new label
router.post('/updateLabel', ctrlAdmin.isLogged, ctrlProfile.updateLabel);
// delete post
router.post('/delpost/:postid', ctrlAdmin.isLogged, ctrlProfile.delPost);
// upload user avatar
router.post('/profile/:id/uploadavatar', ctrlAdmin.isLogged, multipartMiddleware, ctrlProfile.uploadAvatar);
// change user info
router.post('/profile/:id/changeInfo', ctrlAdmin.isLogged, multipartMiddleware, ctrlProfile.changePersonalData);
// change user password
router.post('/profile/:id/changePassword', ctrlAdmin.isLogged, ctrlProfile.changePassword);
// send update post modal
router.post('/profile/updatePostModal', ctrlAdmin.isLogged, ctrlProfile.sendUpdatePostModal);

router.get('/', function (req, res, next) {
    res.redirect('/');
});

module.exports = router;
