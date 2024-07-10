// seed.js
const mongoose = require('mongoose');
const Books = require('./books');

mongoose.connect('mongodb://localhost:27017/library', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
});

const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', async () => {
  console.log('Connected to MongoDB');

  const books = [
    {
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      published: true,
      owner: "123456789012345678901234"
    },
    {
      title: "To Kill a Mockingbird",
      author: "Harper Lee",
      published: true,
      owner: "123456789012345678901234"
    }
  ];

  try {
    const result = await Books.insertMany(books);
    console.log(`Inserted ${result.insertedCount} books`);
  } catch (err) {
    console.error(err);
  }
});