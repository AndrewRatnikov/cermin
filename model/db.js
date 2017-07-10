const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect( 'mongodb://localhost:27017/cermin', { useMongoClient: true } ).then(
  () => { console.log('db is connected') },
  err => { console.error(`Connection error: ${err}`); }
);
