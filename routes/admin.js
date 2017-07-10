const express = require('express');
const router = express.Router();
const ctrlIndex = require('../controllers/index');
const ctrlAdmin =  require('../controllers/admin');

router.get('/login', function( req, res, next ) {
  res.send('Get it');
});

router.get('/register', ctrlAdmin.getRegisterPage);

router.post('/register', ctrlAdmin.registerNewUser, function( req, res, next ) {
  res.redirect('/');
});

router.get('/', function( req, res, next ) {
  res.redirect('/');
});

module.exports = router;
