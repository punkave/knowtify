var fs = require('fs')
var router = require('choreographer').router()

router.get('/', function(req, res) {
  tem('index.html', function(err, template) {
    res.render(template, {title: 'Status'})
  })
})

module.exports = function() {
  router.apply(this, arguments)
}

function tem(path, cb) {
  fs.readFile('templates/'+path, function(err, data) {
    cb(err, data)
  })
}
