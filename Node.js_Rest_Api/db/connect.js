// db/connect.js
const mongoose = require('mongoose');
const Books = require('./books'); // Import the Books model

mongoose.connect('mongodb://localhost:27017/library', {
  //useNewUrlParser: true,
  //useCreateIndex: true,
  //useFindAndModify: false
});

const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to MongoDB'));

