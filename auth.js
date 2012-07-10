var bcrypt = require('bcrypt')
var db = require('./db')

exports.check = function(user, cb) {
  // TODO check the db
  if (user.username == 'admin') {
    cb(null, user)
  } else {
    cb(new Error('Not found'))
  }
}
