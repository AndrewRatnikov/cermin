const express = require('express');
const router = express.Router();
const ctrlIndex = require('../controllers/index');

router.get('/login', function( req, res, next ) {
  res.send('Get it');
});

router.get('/register', function( req, res, next ) {
  res.render('admin/register', { title: 'Registration' });
});

router.get('/', function( req, res, next ) {
  res.redirect('/admin/login');
});

module.exports = router;
