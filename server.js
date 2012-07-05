var Cookies = require('cookies')
var fs = require('fs')
var http = require('http')
var keygrip = require('keygrip')
var RedSess = require('redsess')
var routes = require('./routes')
var whiskers = require('whiskers')
var url = require('url')

var port = process.env.PORT || 5000

var secretKeys = process.env.SECRET ? process.env.SECRET.split(' ') : []
var keys = keygrip(secretKeys)

var redisUrl = process.env.REDISTOGO_URL && url.parse(process.env.REDISTOGO_URL);
if (redisUrl) {
  RedSess.createClient(redisUrl.hostname, redisUrl.port, {auth: redisUrl.auth.split(':')[1]})
} else {
  RedSess.createClient()
}

http.createServer(function(req, res) {
  req.cookies = res.cookies = new Cookies(req, res, keys)
  req.session = res.session = new RedSess(req, res)

  res.render = function(filename, context) {
    fs.readFile('templates/'+filename, function(err, template) {
      if (err) throw err
      context.auth = req.auth
      res.writeHead(200, {'Content-Type': 'text/html'})
      res.end(whiskers.render(template, context))
    })
  }

  req.session.get('auth', function (err, auth) {
    if (err) throw err
    req.auth = auth
    
    // now that req.auth is populated we can call routes
    routes(req, res)
  })
}).listen(port, function() {
  console.log('Listening on '+port)
})
