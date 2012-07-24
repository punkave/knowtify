var util = require('util')

module.exports = function authority(req, res, cb) {
  req.session.get('auth', function(err, auth) {
    if (err) util.log(err)
    if (auth) return cb()
    res.writeHead(401)
    res.end()
  })
}
