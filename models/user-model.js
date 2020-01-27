const db = require('../data/db-config');

module.exports = {
  find,
  findById,
  add,
}

function find() {
  return db('users').select('id', 'username');
}

function findById(id) {
  return db('users')
          .where({ id })
          .select('id', 'username', 'password')
          .first();
}

function add(user) {
  return db('users')
          .insert(user, 'id')
          .then(([id]) => {
            return findById(id);
          })


}

