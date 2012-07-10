var redis = require('redis')
var url = require('url')

var redisUrl = url.parse(process.env.REDISTOGO_URL || 'redis://127.0.0.1:6379')
var client = redis.createClient(redisUrl.port, redisUrl.hostname)
if (redisUrl.auth) client.auth(redisUrl.auth.split(':')[1])

module.exports = client
