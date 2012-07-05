var querystring = require('querystring')
var router = require('choreographer').router()

router.get('/', function(req, res) {
  res.render('index.html', {title: 'Status'})
})

router.get('/login', function(req, res) {
  res.render('login.html')
})

router.post('/login', function(req, res) {
  var data = '';
  req.setEncoding('utf8')
  req.on('data', function(chunk) {
    data += chunk
  })
  req.on('end', function() {
    var body = querystring.parse(data)
    console.log(body)
  })
  res.writeHead(303, {Location: '/login'})
  res.end()
})

module.exports = function() {
  router.apply(this, arguments)
}
