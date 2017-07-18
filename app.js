const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const sass = require('node-sass-middleware');
const postcss = require('postcss-middleware');
const autoprefixer = require('autoprefixer');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const index = require('./routes/index');
const admin = require('./routes/admin');

const app = express();

// connect db
require('./model/db');
// connect strategy
require('./config/passport');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use( session({
  secret: 'Something wrong',
  resave: false,
  saveUninitialized: true,
  store: new MongoStore({ mongooseConnection: mongoose.connection })
}) );
app.use( flash() );
app.use( passport.initialize() );
app.use( passport.session() );
app.use(express.static(path.join(__dirname, 'public')));

// view style engine
app.use(sass({
  src: path.join(__dirname, '/public/sass'),
  dest: path.join(__dirname, '/public/stylesheets'),
  debug: true,
  response: false,
  outputStyle: 'compressed',
  prefix: '/stylesheets'
}));
app.use(postcss({
  plugins: [
    autoprefixer({ browsers: ['> 1%', 'IE 7'], cascade: false })
  ],
  src: function(req) {
    return path.join(__dirname, 'public', req.path);
  }
}));

app.use('/', index);
app.use('/admin', admin);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
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
