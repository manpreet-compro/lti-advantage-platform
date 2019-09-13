const router = require('express').Router();
const AppController = require('./controllers/AppController')

router.get('/status', AppController.getStatus);
router.get('/init-login', AppController.initLogin);
router.post('/auth-oidc', AppController.authOidc);

module.exports = router;