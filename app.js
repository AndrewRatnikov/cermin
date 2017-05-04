var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var sass = require('node-sass-middleware');
var postcss = require('postcss-middleware');
var autoprefixer = require('autoprefixer');

require('./app_api/models/db');

var index = require('./app_server/routes/index');
var api = require('./app_api/routes/index')

var app = express();

//  style engine setup
app.use(sass({
  src: path.join(__dirname, '/app_server/sass'),
  dest: path.join(__dirname, '/public/stylesheets'),
  debug: true,
  outputStyle: 'compressed',
  prefix: '/stylesheets'
}));
app.use('/stylesheets', postcss({
  plugins: [
    autoprefixer({ browsers: ['> 1%', 'IE 7'], cascade: false })
  ],
  src: function(req) {
    return path.join(__dirname, 'public', 'stylesheets', req.path);
  }
}));

// view engine setup
app.set('views', path.join(__dirname, 'app_server/views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/api', api);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
