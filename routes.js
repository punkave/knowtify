var router = require('choreographer').router()

router.get('/', function(req, res) {
  res.render('index.html', {title: 'Status'})
})

module.exports = function() {
  router.apply(this, arguments)
}
