var rut = require('rut')
var stack = require('stack')

module.exports = stack(
  rut('/', require('./routes')),
  rut.get('/login', require('./routes/login')),
  rut.post('/login', require('./routes/loginPost')),
  rut('/logout', require('./routes/logout')),
  rut.post('/notification', require('./routes/notificationAdd')),
  rut.delete('/notification', require('./routes/notificationDelete')),
  rut.get('/**', require('./routes/static'))
)
