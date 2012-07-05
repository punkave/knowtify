var redis = require('redis')

exports.auth = function(user, pass, cb) {
  if (user == 'admin') {
    cb()
  } else {
    cb(new Error('Not found'))
  }
}
