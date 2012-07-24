module.exports = function(req, res) {
  req.session.get('auth', function(err, auth) {
    if (auth) {
      res.writeHead(303, {Location: '/'})
      res.end()
    } else {
      req.session.get('flash', function(err, flash) {
        req.session.del('flash')
        res.context.flash = flash
        res.render('login.html')
      })
    }
  })
}
