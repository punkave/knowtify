var db = require('../db')
var fs = require('fs')
var pile = require('pile')
var request = require('request')
var settings = require('../settings')
var util = require('util')

module.exports = pile(
  function(req, res, last) {
    db.lrange('knowtify:notifications', 0, 9, function(err, notifications) {
      notifications = notifications.map(function(str) {
        var notification = JSON.parse(str)
        notification.raw = encodeURIComponent(str)
        // handle conversion in the client
        //notification.time = moment(notification.time).format('MM/DD/YYYY h:mma')
        return notification
      })
      res.context.notifications = notifications
      last()
    })
  },
  function(req, res, last) {
    fs.readFile('templates/notification.html', function(err, data) {
      if (err) util.log(err)
      res.context.partials = {notification: data}
      last()
    })
  },
  function(req, res, last) {
    request(settings.monitor, function(err, checkRes, body) {
      if (err) {
        util.log(err)
        return last()
      }
      if (checkRes.statusCode != 200) {
        util.log('Monitor HTTP code:', checkRes.statusCode)
        return last()
      }
      var sites = JSON.parse(body)
      sites.sort(function(a, b) {
        return a.name.localeCompare(b.name)
      })
      var columns = [[], [], [], []]
      var ok = true
      for (var i=0; i<sites.length; i++) {
        columns[Math.floor(i * columns.length / sites.length)].push(sites[i])
        if (!sites[i].ok) ok = false
      }
      res.context.columns = columns
      res.context.ok = ok
      last()
    })
  },
  function(req, res, last) {
    req.session.get('auth', function(err, auth) {
      if (err) util.log(err)
      res.context.auth = auth
      last()
    })
  },
  function(req, res) {
    res.context.settings = settings
    res.render('index.html')
  }
)
