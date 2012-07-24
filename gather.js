module.exports = function gather() {
  var args = Array.prototype.slice.call(arguments)
  var cb = args.pop()
  return function(req, res) {
    var pending = args.length
    if (!pending) return cb(req, res)
    args.forEach(function(fn) {
      fn(req, res, function() {
        if (!--pending) cb(req, res)
      }) 
    })
  }
}
