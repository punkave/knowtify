var db = require('./db')

// TODO move settings to DB
exports.checkUrl = process.env.CHECKER || 'http://127.0.0.1:5001'
exports.title = process.env.TITLE || 'Status'
