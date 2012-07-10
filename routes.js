var auth = require('./auth')
var db = require('./db')
var paperboy = require('paperboy')
var querystring = require('querystring')
var request = require('request')
var router = require('choreographer').router()
var settings = require('./settings')
var util = require('util')

paperboy.contentTypes.less = 'text/css';

router.get('/', function(req, res) {
  var context = {
    settings: settings
  }
  var pending = 2
  function done() {
    if (!--pending) res.render('index.html', context)
  }
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
  getBody(req, function(body) {
    auth.check(body, function(err, user) {
      if (err) {
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
    res.writeHead(303, {Location: '/'})
    res.end()
  })
})

router.put('/user/*', function(req, res, username) {
  getBody(req, function(body) {
    auth.create(username, body, function() {
    })
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
  req.setEncoding('utf8')
  req.on('data', function(chunk) {body += chunk})
  req.on('end', function() {
    var parseMap = {
      'application/x-www-form-urlencoded': querystring.parse,
      'application/json': JSON.parse,
      pass: function(body) {return body}
    }
    var ct = req.headers['content-type'] || 'pass'
    cb(parseMap[ct](body))
  })
}
