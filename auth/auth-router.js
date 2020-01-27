const router = require('express').Router();
const bcrypt = require('bcryptjs');
const Users = require('../models/user-model');

router.post('/register', (req, res) => {
  let user = req.body;
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

module.exports = router;