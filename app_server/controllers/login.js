var request = require('request');
var apiOptions = {
  server: "http://localhost:3000"
}

module.exports.loginpage = function(req, res) {
  res.render('login', { title: 'Login' });
}

module.exports.loginToPage = function(req, res) {
  if (!req.body.name || !req.body.password) {
    res.render('login', { title: 'Login', error: 'All fields required, please try again' })
  }
  console.log(req.body);
}