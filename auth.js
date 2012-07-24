var settings = require('./settings')

exports.check = function(user, cb) {
  if (user.username == settings.username && user.password == settings.password) {
    cb(null, user)
  } else {
    cb(new Error('Not found'))
  }
}
