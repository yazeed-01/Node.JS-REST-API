const express = require('express');
const Authors = require('../db/authors');
const auth = require('../MiddleWare/auth');
const multer = require('multer');
const router = new express.Router();

const avatar = multer({
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|png|JPG|PNG|JPEG|jpeg)$/))
      return cb(new Error('This is not a correct format of the file'));
    cb(undefined, true);
  }
});

router.post('/authors', async (req, res) => {
  const author = new Authors(req.body);
  try {
    const token = await author.generateAuthToken();
    res.status(201).send({ author, token });
  } catch (e) {
    res.status(400).send(e.message);
  }
});

router.post('/authors/login', async (req, res) => {
  try {
    const author = await Authors.findByCredentials(req.body.email, req.body.password);
    const token = await author.generateAuthToken();
    res.status(200).send({ author, token });
  } catch (e) {
    res.status(400).send(e.message);
  }
});

router.post('/authors/me/avatar', auth, avatar.single('avatar'), async (req, res) => {
  req.author.avatar = req.file.buffer;
  await req.author.save();
  res.send(req.author);
}, (err, req, res, next) => res.status(404).send({ error: err }));

router.get('/authors/:id/avatar', async (req, res) => {
  try {
    const author = await Authors.findById(req.params.id);
    if (!author ||!author.avatar) throw new Error();

    res.set('Content-Type', 'image/jpg');
    res.send(author.avatar);
  } catch (e) {
    res.status(404).send();
  }
});

router.get('/authors/logout', auth, async (req, res) => {
  try {
    req.author.tokens = req.author.tokens.filter(token => token.token!== req.token);
    await req.author.save();
    res.status(200).send(req.author);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

router.get('/authors/me', auth, async (req, res) => {
  res.status(200).send(req.author);
});

router.patch('/authors/me', auth, async (req, res) => {
  const allowedUpdates = ['name', 'bio'];
  const keys = Object.keys(req.body);
  const isUpdationValid = keys.every(key => allowedUpdates.includes(key));
  if (!isUpdationValid) res.status(400).send();
  try {
    keys.forEach(update => req.author[update] = req.body[update]);
    await req.author.save();
    res.status(200).send(req.author);
  } catch (e) {
    res.status(400).send();
  }
});

router.delete('/authors/me', auth, async (req, res) => {
  try {
    await req.author.remove();
    res.status(200).send();
  } catch (e) {
    res.status(400).send();
  }
});

module.exports = router;