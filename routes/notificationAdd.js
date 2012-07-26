var authority = require('../authority')
var db = require('../db')
var pile = require('pile')
var scalpel = require('scalpel')
var util = require('util')

module.exports = pile(
  scalpel, 
  authority, 
  function(req, res) {
    req.body.time = Date.now()
    var data = JSON.stringify(req.body)
    db.lpush('knowtify:notifications', data, function(err) {
      if (err) {
        util.log(err)
        res.writeHead(500)
        return res.end()
      }
      res.writeHead(200, {'Content-Type': 'application/json'})
      res.end(data)
    })
  }
)
