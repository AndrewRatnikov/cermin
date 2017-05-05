var express = require('express');
var router = express.Router();

var ctrlIndex = require('../controllers/index');
var ctrlAdmin = require('../controllers/login');

/* GET home page. */
router.get('/', ctrlIndex.homepage);

/* login to admin */
router.get('/logintoadmin', ctrlAdmin.loginpage);
router.post('/logintoadmin', ctrlAdmin.loginToPage);

/* Admin part of site */
router.get('/admin/catalog', ctrlAdmin.getCatalog);

module.exports = router;
