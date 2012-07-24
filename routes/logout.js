var util = require('util')

module.exports = function(req, res) {
  req.session.del('auth', function (err) {
    if (err) util.log(err)
    res.writeHead(303, {Location: '/'})
    res.end()
  })
}
