var dirname = require('path').dirname
var send = require('send')

module.exports = function(req, res, path) {
  send(req, path).from(dirname(__dirname)+'/static').pipe(res)
}
