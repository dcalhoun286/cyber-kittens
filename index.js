const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { User, Kitten } = require('./db');
const JWT_SECRET = process.env.JWT_SECRET;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', async (req, res, next) => {
  try {
    res.send(`
      <h1>Welcome to Cyber Kittens!</h1>
      <p>Cats are available at <a href="/kittens/1">/kittens/:id</a></p>
      <p>Create a new cat at <b><code>POST /kittens</code></b> and delete one at <b><code>DELETE /kittens/:id</code></b></p>
      <p>Log in via POST /login or register via POST /register</p>
    `);
  } catch (err) {
    console.error(err);
    next(err)
  }
});

// Verifies token with jwt.verify and sets req.user

const setUser = async (req, res, next) => {
  try {
    const auth = req.header('Authorization');
    if (!auth) {
      next();
    } else {
      const [, token] = auth.split(' ');
      const payload = jwt.verify(token, JWT_SECRET);
      req.user = payload;
      next();
    }
  } catch (err) {
    console.error(err);
    next(err);
  }
};

// POST /register

app.post('/register', async (req, res, next) => {

  try {

    const { username, password } = req.body;
    const createUser = await User.create({ username, password });

    const user = {
      id: createUser.id,
      username: createUser.username,
    };

    const token = jwt.sign({ user }, JWT_SECRET);
    res.status(200).send({ message: 'success', token });

  } catch (err) {

    console.error(err);
    next(err);

  }
});

// POST /login

app.post('/login', async (req, res, next) => {
  try {

    const { username, password } = req.body;
    const foundUser = await User.findOne({
      where: { username }
    });

    if (!foundUser) {
      res.status(401).send('Unauthorized');
    } else {
      const validPassword = await bcrypt.compare(password, foundUser.password);
      if (!validPassword) {
        res.status(401).send('Unauthorized');
      }

      const user = {
        id: foundUser.id,
        username: foundUser.username,
      };

      const token = jwt.sign({ user }, JWT_SECRET);
      res.status(200).send({  message: 'success', token });
    }
  } catch (err) {
    console.error(err);
    next(err);
  }
});

// GET /kittens/:id

app.get('/kittens/:id', setUser, async (req, res, next) => {

  try {

    if (!req.user) {
      res.status(401).send('Unauthorized');
    } else {
      const foundKitten = await Kitten.findByPk(req.params.id);

      if (foundKitten) {

        if (foundKitten.ownerId === req.user.id) {
          const { name, age, color } = foundKitten;
          res.status(200).send({ name, age, color });
        } else {
          res.status(401).send('Unauthorized');
        }
      } else {
        res.status(404).send('Not found');
      }
    }


  } catch (err) {
    console.error(err);
    next(err);
  }

});

// GET /kittens

app.get('/kittens', async (req, res, next) => {

  try {

    const foundKittens = await Kitten.findAll();
  
    if (foundKittens.length) {
      res.status(200).send(foundKittens);
    } else {
      res.status(404).send('Not found');
    }

  } catch (err) {
    console.error(err);
    next(err);
  }
});

// POST /kittens

app.post('/kittens', setUser, async (req, res, next) => {

  try {

    if (!req.user) {
      res.status(401).send('Unauthorized');
    } else {
      const { name, color, age } = req.body;
      const newKitten = await Kitten.create({ name, color, age });
      res.status(201).send({ name: newKitten.name, age: newKitten.age, color: newKitten.color });
    }
  } catch (err) {
    console.error(err);
    next(err);
  }
});

// DELETE /kittens/:id

app.delete('/kittens/:id', setUser, async (req, res, next) => {

  const kittenToDelete = await Kitten.findByPk(req.params.id);

  try {

    if ((!req.user) || (kittenToDelete.ownerId !== req.user.id)) {
      res.status(401).send('Unauthorized');
    } else {
      await kittenToDelete.destroy();
      res.sendStatus(204);
    }
  } catch (err) {
    console.error(err);
    next(err);
  }

});

// error handling middleware, so failed tests receive them
app.use((error, req, res, next) => {
  console.error('SERVER ERROR: ', error);
  if (res.statusCode < 400) res.status(500);
  res.send({ error: error.message, name: error.name, message: error.message });
});

// we export the app, not listening in here, so that we can run tests
module.exports = app;
