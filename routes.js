const router = require('express').Router();
const AppController = require('./controllers/AppController')

router.get('/', AppController.getStatus)

module.exports = router;