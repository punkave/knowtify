var redis = require('redis')

exports.auth = function(user, pass, cb) {
  // all users pass for now
  cb()
  //cb(new Error('Not found'))
}
