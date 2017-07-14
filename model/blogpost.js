const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
  photoUrl: String,
  title: { type: String, required: true },
  descriptiond: String
});

module.exports = mongoose.model('Post', postSchema);
