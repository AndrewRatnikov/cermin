const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/cermin', { useMongoClient: true, promiseLibrary: global.Promise });

const Label = require('../model/label');

const test1 = new Label({ label: 'test1' });

test1.save((err) => { err ? console.log(err) : console.log('added') });
