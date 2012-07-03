var fs = require('fs')
var http = require('http')
var routes = require('./routes')
var whiskers = require('whiskers')

var port = process.env.PORT || 8080

http.createServer(function(req, res) {
  res.render = function(filename, context) {
    fs.readFile('templates/'+filename, function(err, template) {
      if (err) throw err
      res.writeHead(200, {'Content-Type': 'text/html'})
      res.end(whiskers.render(template, context))
    })
  }
  routes(req, res)
}).listen(port, function() {
  console.log('Listening on '+port)
})
