var Cookies = require('cookies')
var fs = require('fs')
var http = require('http')
var keygrip = require('keygrip')
var RedSess = require('redsess')
var router = require('./router')
var whiskers = require('whiskers')
var url = require('url')

var port = process.env.PORT || 5000

var secretKeys = process.env.SECRET ? process.env.SECRET.split(' ') : []
var keys = keygrip(secretKeys)

var redisUrl = process.env.REDISTOGO_URL && url.parse(process.env.REDISTOGO_URL)
var redisOptions = redisUrl && {
  port: redisUrl.port, 
  host: redisUrl.hostname, 
  auth: redisUrl.auth.split(':')[1]
}
RedSess.createClient(redisOptions)

http.createServer(function(req, res) {
  req.cookies = res.cookies = new Cookies(req, res, keys)
  req.session = res.session = new RedSess(req, res)

  res.context = {}
  res.render = function(filename) {
    fs.readFile('templates/'+filename, function(err, template) {
      if (err) throw err
      res.writeHead(200, {'Content-Type': 'text/html'})
      res.end(whiskers.render(template, res.context))
    })
  }
    
  router(req, res)
}).listen(port, function() {
  console.log('Listening on '+port)
})
