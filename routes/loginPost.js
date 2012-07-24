var scalpel = require('scalpel')
var settings = require('../settings')

module.exports = function(req, res) {
  scalpel(req, res, function() {
    if (req.body.username == settings.username && 
        req.body.password == settings.password) {
      req.session.set('auth', req.body)
      res.writeHead(303, {Location: '/'})
    } else {
      req.session.set('flash', 'Incorrect username or password.')
      res.writeHead(303, {Location: '/login'})
    }
    res.end()
  })
}
