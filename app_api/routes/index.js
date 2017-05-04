var express = require('express');
var router = express.Router();

var ctrlAuth = require('../controllers/authentification');

router.post('/authentificate', ctrlAuth.login);
router.post('/registration', ctrlAuth.register);

module.exports = router;