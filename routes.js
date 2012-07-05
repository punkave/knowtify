var db = require ('./db')
var querystring = require('querystring')
var router = require('choreographer').router()

router.get('/', function(req, res) {
  req.session.get('auth', function(err, auth) {
    res.render('index.html', {title: 'Status', auth: auth})
  })
})

router.get('/login', function(req, res) {
  req.session.get('auth', function(err, auth) {
    if (auth) {
      res.writeHead(303, {Location: '/'})
      res.end()
    } else {
      req.session.get('flash', function(err, flash) {
        req.session.del('flash')
        res.render('login.html', {flash: flash})
      })
    }
  })
})

router.post('/login', function(req, res) {
  var body = '';
  req.setEncoding('utf8')
  req.on('data', function(chunk) {
    body += chunk
  })
  req.on('end', function() {
    var form = querystring.parse(body)
    db.auth(form.username, form.password, function(err) {
      if (err) {
        req.session.set('flash', 'Incorrect username or password.')
        res.writeHead(303, {Location: '/login'})
        return res.end()
      }
      req.session.set('auth', {username: form.username})
      res.writeHead(303, {Location: '/'})
      res.end()
    })
  })
})

router.get('/logout', function(req, res) {
  req.session.del('auth', function (err) {
    res.writeHead(303, {Location: '/'})
    res.end()
  })
})

module.exports = function() {
  router.apply(this, arguments)
}
