const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    photoUrl: [String],
    title: {type: String, required: true},
    description: {type: String, required: true},
    author: {type: String, required: true},
    label: String,
    date: Date
});

module.exports = mongoose.model('Post', postSchema);
