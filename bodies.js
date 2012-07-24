var querystring = require('querystring')

module.exports = function bodies(req, res, cb) {
  var ct = req.headers['content-type']
  req.body = ''
  req.setEncoding('utf8')
  req.on('data', function(chunk) {req.body += chunk})
  req.on('end', function() {
    var parser, parsers = [
      {
        mime: 'application/x-www-form-urlencoded',
        parse: querystring.parse
      },
      {
        mime: 'application/json',
        parse: JSON.parse
      }
    ]
    for (var i=0; i<parsers.length; i++) {
      parser = parsers[i]
      if (ct.indexOf(parser.mime) != -1) {
        req.body = parser.parse(req.body)
      }
    }
    cb()
  })
}
