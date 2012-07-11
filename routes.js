var auth = require('./auth')
var db = require('./db')
var fs = require('fs')
var paperboy = require('paperboy')
var querystring = require('querystring')
var request = require('request')
var router = require('choreographer').router()
var settings = require('./settings')
var util = require('util')

paperboy.contentTypes.less = 'text/css';

router.get('/', function(req, res) {
  var context = {
    partials: {},
    settings: settings
  }
  var pending = 3
  function done() {
    if (!--pending) res.render('index.html', context)
  }
  fs.readFile('templates/notificaton.html', function(err, data) {
    context.partials.notification = data
    done()
  })
  request(settings.checkUrl, function(err, checkRes, body) {
    if (err || checkRes.statusCode != 200) {
      util.log(err)
      return done()
    }
    var sites = JSON.parse(body)
    sites.sort(function(a, b) {
      return a.name.localeCompare(b.name)
    })
    var columns = [[], [], [], []]
    for (var i=0; i<sites.length; i++) {
      columns[Math.floor(i * columns.length / sites.length)].push(sites[i])
    }
    context.columns = columns
    done()
  })
  req.session.get('auth', function(err, auth) {
    context.auth = auth
    done()
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
  getBody(req, function(err, body) {
    auth.check(body, function(authErr, user) {
      if (authErr) {
        req.session.set('flash', 'Incorrect username or password.')
        res.writeHead(303, {Location: '/login'})
        return res.end()
      }
      req.session.set('auth', user)
      res.writeHead(303, {Location: '/'})
      res.end()
    })
  })
})

router.get('/logout', function(req, res) {
  req.session.del('auth', function (err) {
    if (err) util.log(err)
    res.writeHead(303, {Location: '/'})
    res.end()
  })
})

router.put('/user/*', function(req, res, username) {
  getBody(req, function(err, body) {
    auth.create(username, body, function() {
      // TODO admin user management
    })
  })
})

router.post('/notification', function(req, res) {
  getBody(req, function(err, body) {
    res.writeHead(200, {'Content-Type': 'application/json'})
    res.end('{"ok": true}')
  })
})

router.get('/**', function(req, res, path) {
  paperboy.deliver(__dirname+'/static', req, res)
  .error(function(stat, msg) {
    util.log(msg)
  })
})

module.exports = function() {
  router.apply(this, arguments)
}

function getBody(req, cb) {
  var body = ''
  var ct = req.headers['content-type']
  req.setEncoding('utf8')
  req.on('data', function(chunk) {body += chunk})
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
        return cb(null, parser.parse(body))
      }
    }
    // if no match just return body
    cb(null, body)
  })
}
