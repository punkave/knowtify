var dirname = require('path').dirname
var paperboy = require('paperboy')
var util = require('util')

paperboy.contentTypes.less = 'text/css';

module.exports = function(req, res, path) {
  paperboy.deliver(dirname(__dirname)+'/static', req, res)
  .error(function(stat, msg) {
    util.log(msg)
  })
}
