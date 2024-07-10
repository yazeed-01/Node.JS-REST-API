# Node.js Book API

A RESTful API built with Node.js for managing a book collection. Allows users to create, read, update, and delete books, as well as manage authors.

## Features

* CRUD operations for books
* CRUD operations for authors
* MongoDB as the database
* Basic authentication and validation


### Dependencies
* "bcryptjs",
* "express",
* "jsonwebtoken",
* "mongoose",
* "multer",
* "validator",



## API Endpoints

### Books

* `GET /books`: Retrieve a list of all books.
* `POST /books`: Create a new book.
* `GET /books/:id`: Retrieve a single book by ID.
* `PUT /books/:id`: Update a single book by ID.
* `DELETE /books/:id`: Delete a single book by ID.

### Authors

* `GET /authors`: Retrieve a list of all authors.
* `POST /authors`: Create a new author.
* `GET /authors/:id`: Retrieve a single author by ID.
* `PUT /authors/:id`: Update a single author by ID.
* `DELETE /authors/:id`: Delete a single author by ID.
* `GET /authors/:id/books`: Retrieve a list of books written by a specific author.

