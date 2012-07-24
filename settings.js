var db = require('./db')
var util = require('util')

if (process.env.SECRET) {
  exports.secret = process.env.SECRET
} else {
  util.log('No secret key provided for API. Using default instead.')
  exports.secret = 'SEKRIT'
}
exports.monitor = process.env.MONITOR || 'http://127.0.0.1:5001'
exports.title = process.env.TITLE || 'Status'
exports.infobox = process.env.INFOBOX || 'These are some things we want to say. If you have questions or comments, you can contact us at <a href="mailto:info@example.com">info@example.com</a>.'
exports.username = process.env.USERNAME || 'username'
exports.password = process.env.PASSWORD || 'password'
