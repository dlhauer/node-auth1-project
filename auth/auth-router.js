const router = require('express').Router();
const bcrypt = require('bcryptjs');
const Users = require('../models/user-model');

router.post('/register', validateUser, (req, res) => {
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

router.post('/login', validateUser, (req, res) => {
  const { username, password } = req.body;
  Users.findBy({ username })
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        req.session.loggedIn = true;
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

router.get('/users', (req, res) => {
  if (req.session && req.session.loggedIn) {
    Users.find()
      .then(users => {
        res.status(200).json(users);
      })
      .catch(error => {
        console.log(error);
        res.status(500).json({
          error: 'Failed to get users.'
        })
      })
  } else {
    res.status(401).json({
      message: 'You shall not pass!'
    });
  }
  
})

const requiredFields = [
  'username',
  'password'
];

function checkMissingFields(reqBody) {
  const reqBodyKeys = Object.keys(reqBody);
  const missingFields = requiredFields.filter(field => {
    return !reqBodyKeys.includes(field);
  });
  return missingFields;
}

function validateUser(req, res, next) {
  const missingFields = checkMissingFields(req.body);
  if (missingFields.length > 0) {
    res.status(400).json({
      message: `Missing the following required field(s): ${missingFields.join(', ')}`
    })
  } else {
    next();
  }
}
module.exports = router;