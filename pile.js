module.exports = function pile() {
  var args = Array.prototype.slice.call(arguments)
  var last = args.pop()
  return function(req, res, next) {
    var pending = args.length
    if (!pending) return last(req, res, next)
    args.forEach(function(fn) {
      fn(req, res, function() {
        if (!--pending) last(req, res, next)
      }) 
    })
  }
}
