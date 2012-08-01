var dirname = require('path').dirname
var send = require('send')

module.exports = function(req, res, next, path) {
  send(req, path).from(dirname(__dirname)+'/static').pipe(res)
}
