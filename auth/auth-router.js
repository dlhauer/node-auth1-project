const router = require('express').Router();
const bcrypt = require('bcryptjs');
const Users = require('../models/user-model');

router.post('/register', (req, res) => {
  const user = req.body;
  const hash = bcrypt.hashSync(user.password, 10);
  user.password = hash;
  Users.add(user)
    .then(user => {
      res.status(201).json(user);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        error: 'Error saving new user.'
      });
    });
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  Users.findBy({ username })
    .then(user => {
      console.log('password: ', password, 'user.password: ', user.password)
      if (user && bcrypt.compareSync(password, user.password)) {
        res.status(200).json({
          message: `Welcome, ${user.username}.`
        });
      } else {
        res.status(401).json({
          message: 'Invalid credentials!'
        })
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        error: 'Failed to log in.'
      });
    });
});
module.exports = router;