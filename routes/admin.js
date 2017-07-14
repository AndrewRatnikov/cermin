const express = require('express');
const router = express.Router();
const ctrlIndex = require('../controllers/index');
const ctrlAdmin =  require('../controllers/admin');

router.get('/login', ctrlAdmin.getLoginPage);

router.post('/login', ctrlAdmin.loginUser, function( req, res, next ) {
  res.redirect('/');
});

router.get('/register', ctrlAdmin.getRegisterPage);

router.post('/register', ctrlAdmin.registerNewUser, function( req, res, next ) {
  res.redirect('/');
});

router.get('/', function( req, res, next ) {
  res.redirect('/');
});

module.exports = router;
