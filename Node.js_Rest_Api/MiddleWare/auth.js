// auth.js
const jwt = require('jsonwebtoken');
const Authors = require('../db/authors');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      throw new Error('No token provided');
    }

    const decoded = jwt.verify(token, 'thisismynewcourse');
    const author = await Authors.findOne({ _id: decoded._id, 'tokens.token': token });

    if (!author) {
      throw new Error('Invalid token');
    }

    req.token = token;
    req.author = author;
    next();
  } catch (error) {
    res.status(401).send({ error: 'Authentication failed' });
  }
};

module.exports = auth;