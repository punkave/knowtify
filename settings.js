var db = require('./db')

// TODO move settings to DB
exports.checkUrl = process.env.CHECKER || 'http://127.0.0.1:5001'
exports.title = process.env.TITLE || 'Status'
exports.infobox = process.env.INFOBOX || 'These are some things we want to say. If you have questions or comments, you can contact us at <a href="mailto:info@example.com">info@example.com</a>.'
