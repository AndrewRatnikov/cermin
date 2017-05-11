// elements for API
// var request = require('request');
// var apiOptions = {
//   server: "http://localhost:3000"
// };
var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');

module.exports.loginpage = function(req, res) {
  res.render('login', { title: 'Login' });
};

module.exports.loginToPage = function(req, res) {
  
  if (!req.body.name || !req.body.password) {
    res.render('login', { title: 'Login', error: 'All fields required, please try again' });
  } else {
    passport.authenticate('local', function(err, user, info) {
      console.log(err, user, info);
      if (err) {
        res.render('login', { title: 'Login', error: err });
      } else {
        if (user) {
          var token = user.generateJwt();
          res.cookie('cerminToken', token);
          res.redirect('/admin/catalog');
        } else {
          res.render('login', { title: 'Login', error: info });
        }
      }
    });
  }

  // Elements for API
  // var path = '/api/authentificate';
  // if (!req.body.name || !req.body.password) {
  //   res.render('login', { title: 'Login', error: 'All fields required, please try again' });
  // } else {
  //   var requestOptions = {
  //     url: apiOptions.server + path,
  //     method: "POST",
  //     json: {
  //       name: req.body.name,
  //       password: req.body.password
  //     }
  //   };
  //   request(requestOptions, function(error, response, body) {
  //     if (error) {
  //       return console.error('error: ', error);
  //     }
  //     if (response.statusCode === 200) {
  //       res.cookie('cerminToken', body.token);
  //       res.redirect('/admin/catalog');
  //     } else {
  //       res.render('login', { title: 'Error', error: body.message });
  //     }
  //   });
  // }
};

module.exports.getCatalog = function(req, res) {
  res.render('catalog', { title: "Catalog" });
};