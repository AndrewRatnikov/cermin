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
router.get('/register', ctrlAdmin.getRegisterPage);
// register new user
router.post('/register', ctrlAdmin.registerNewUser, function (req, res, next) {
    res.redirect('/');
});
// logout from account
router.get('/logout', ctrlAdmin.logout);
// go to delete user page
router.get('/deluser', ctrlAdmin.isLogged, ctrlAdmin.getDelPage);
// delete user
router.post('/deluser', ctrlAdmin.isLogged, ctrlAdmin.deleteUser);
// go to profile page
router.get('/profile/:id', ctrlAdmin.isLogged, ctrlProfile.getUserPage);
// get new post
router.post('/profile/:id', ctrlAdmin.isLogged, multipartMiddleware, ctrlProfile.addPost);
// delete post
router.post('/profile/:id/delpost/:postid', ctrlAdmin.isLogged, ctrlProfile.delPost);
// upload user avatar
router.post('/profile/:id/uploadavatar', ctrlAdmin.isLogged, multipartMiddleware, ctrlProfile.uploadAvatar);

router.get('/', function (req, res, next) {
    res.redirect('/');
});

module.exports = router;
