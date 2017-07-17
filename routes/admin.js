const express = require('express');
const router = express.Router();
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart();

const ctrlIndex = require('../controllers/index');
const ctrlAdmin =  require('../controllers/admin');

router.get('/login', ctrlAdmin.getLoginPage);

router.post('/login', ctrlAdmin.loginUser, function( req, res, next ) {
  const id = req.session.passport.user;
  res.redirect(`profile/${id}`);
});

router.get('/register', ctrlAdmin.getRegisterPage);

router.post('/register', ctrlAdmin.registerNewUser, function( req, res, next ) {
  res.redirect('/');
});

router.get('/logout', ctrlAdmin.logout);

router.get('/deluser', ctrlAdmin.isLogged, ctrlAdmin.getDelPage);

router.post('/deluser', ctrlAdmin.isLogged, ctrlAdmin.deleteUser);

router.get('/profile/:id', ctrlAdmin.isLogged, ctrlAdmin.getUserPage);

router.post('/profile/:id/uploadavatar', ctrlAdmin.isLogged, multipartMiddleware, ctrlAdmin.uploadAvatar);

router.get('/', function( req, res, next ) {
  res.redirect('/');
});

module.exports = router;
