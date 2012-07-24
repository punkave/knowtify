var authority = require('../authority')
var db = require('../db')
var pile = require('../pile')
var scalpel = require('scalpel')
var util = require('util')

module.exports = pile(
  scalpel,
  authority,
  function(req, res) {
    db.lrem('knowtify:notifications', 1, req.body.value, function(err) {
      if (err) {
        util.log(err)
        res.writeHead(500)
        return res.end()
      }
      res.writeHead(200, {'Content-Type': 'application/json'})
      res.end('{"ok": true}')
    })
  }
)
