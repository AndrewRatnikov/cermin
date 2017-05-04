var mongoose = require('mongoose');
var readline = require('readline');
var dbURI = 'mongodb://localhost/cermin';

var gracefulShutdown = function(msg, callback) {
  mongoose.connection.close(function() {
    console.log('mongoose disconected: ' + msg);
    callback();
  });
};

if (process.platform === 'win32') {
  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.on('SIGINT', function() {
    process.emit('SIGINT');
  });
}

mongoose.Promise = global.Promise;
mongoose.connect(dbURI);

mongoose.connection.on('connected', function() {
  console.log('Mongoose connected to ' + dbURI);
});
mongoose.connection.on('error', function(err) {
  console.log('Mongoose error: ' + err);
});
mongoose.connection.on('disconnected', function() {
  console.log('Mongoose disconnected');
});

process.once('SIGUSR2', function() {
  gracefulShutdown('nodemon restart', function() {
    process.kill(process.pid, 'SIGNUSR2');
  });
});
process.on('SIGNINT', function() {
  gracefulShutdown('app termination', function() {
    process.exit(0);
  });
});
process.on('SIGNTERM', function() {
  gracefulShutdown('Heroku app shutdown', function() {
    process.exit(0);
  });
});

require('./users');