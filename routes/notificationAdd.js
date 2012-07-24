var authority = require('../authority')
var bodies = require('../bodies')
var db = require('../db')
var gather = require('../gather')
var util = require('util')

module.exports = gather(
  bodies, 
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
