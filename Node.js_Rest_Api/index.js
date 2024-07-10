require('./db/connect')
const express = require('express');
const app = express();
const authorsRouter = require('./routers/authors');
const booksRouter = require('./routers/books');
const Book = require('./db/books');

app.use(express.json());

app.use('/authors', authorsRouter);
app.use('/books', booksRouter);





const port = process.env.PORT?? 3000;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});