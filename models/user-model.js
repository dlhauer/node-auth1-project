const db = require('../data/db-config');

module.exports = {
  find,
  findBy,
  findById,
  add,
}

function find() {
  return db('users').select('id', 'username');
}

function findBy(filter) {
  return db('users')
          .select('id', 'username', 'password')
          .where(filter)
          .first();
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

