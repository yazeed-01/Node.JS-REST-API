// routers/books.js
const express = require('express');
const Authors = require('../db/books');
const auth = require('../MiddleWare/auth');

const router = express.Router();

router.post('/books', auth, async (req, res) => {
  const book = new Books({...req.body, owner: req.author._id });
  try {
    await book.save();
    res.status(201).send(book);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

router.get('/books', auth, async (req, res) => {
  const match = {};
  const sort = {};
  if (req.query.isPublished) {
    match.isPublished = req.query.isPublished === 'true';
  }
  if (req.query.sortBy) {
    const str = req.query.sortBy.split(':');
    sort[str[0]] = str[1] === 'desc'? -1 : 1;
  }
  try {
    await req.author.populate({
      path: 'books',
      match,
      options: {
        limit: parseInt(req.query.limit),
        skip: parseInt(req.query.skip),
        sort,
      },
    }).execPopulate();
    res.status(200).send(req.author.books);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

router.get('/books/:id', auth, async (req, res) => {
  try {
    const book = await Books.findOne({ _id: req.params.id, owner: req.author._id });
    if (!book) return res.status(404).send();
    res.status(200).send(book);
  } catch (e) {
    res.status(400).send();
  }
});

router.patch('/books/:id', auth, async (req, res) => {
  const allowedUpdates = ['title', 'description', 'price'];
  const keys = Object.keys(req.body);
  const isUpdationValid = keys.every((key) => allowedUpdates.includes(key));
  if (!isUpdationValid) res.status(400).send();
  try {
    const book = await Books.findOne({ _id: req.params.id, owner: req.author._id });
    if (!book) return res.status(404).send();
    Object.assign(book, req.body);
    await book.save();
    res.status(200).send(book);
  } catch (e) {
    res.status(400).send();
  }
});

router.delete('/books/:id', auth, async (req, res) => {
  try {
    const book = await Books.findOne({ _id: req.params.id, owner: req.author._id });
    if (!book) return res.status(404).send();
    await book.remove();
    res.status(200).send(book);
  } catch (e) {
    res.status(400).send();
  }
});

module.exports = router;