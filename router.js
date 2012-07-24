var router = require('choreographer').router()

router.get('/', require('./routes'))
router.get('/login', require('./routes/login'))
router.post('/login', require('./routes/loginPost'))
router.get('/logout', require('./routes/logout'))
router.post('/notification', require('./routes/notificationAdd'))
router.delete('/notification', require('./routes/notificationDelete'))
router.get('/**', require('./routes/static'))

module.exports = router
