const mongoose = require('mongoose');
const crypto = require('crypto');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  url: String,
  title: { type: String, required: true },
  text: { type: String, required: true },
  createdOn: { type: Date, 'default': Date.now() }
});

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  name: String,
  urlAvatar: String,
  hash: { type: String, required: true },
  salt: { type: String, required: true },
  comments: [ PostSchema ]
});

userSchema.methods.setPassword = function(password) {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(new Buffer(password, 'binary'), this.salt, 1000, 64, 'sha256').toString('hex');
};

userSchema.methods.validPassword = function(password) {
  var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha256').toString('hex');
  return this.hash === hash;
};

module.exports = mongoose.model('User', userSchema);
