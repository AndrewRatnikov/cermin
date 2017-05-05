var request = require('request');
var apiOptions = {
  server: "http://localhost:3000"
}

module.exports.loginpage = function(req, res) {
  res.render('login', { title: 'Login' });
}

module.exports.loginToPage = function(req, res) {
  console.log(req.cookies.cerminToken);
  var path = '/api/authentificate';
  if (!req.body.name || !req.body.password) {
    res.render('login', { title: 'Login', error: 'All fields required, please try again' })
  } else {
    var requestOptions = {
      url: apiOptions.server + path,
      method: "POST",
      json: {
        name: req.body.name,
        password: req.body.password
      }
    };
    request(requestOptions, function(error, response, body) {
      if (error) {
        return console.error('error: ', error);
      }
      if (response.statusCode === 200) {
        res.cookie('cerminToken', body.token);
        res.redirect('/');
      } else {
        res.render('login', { title: 'Error', error: body.message })
      }
    });
  }
}