const router = require('express').Router();
const AppController = require('./controllers/AppController')

router.get('/init-login', AppController.initLogin);
// router.post('/auth-oidc', AppController.authOidc);
router.get('/oidc', AppController.authOidc);

router.get('/keys', AppController.getPublicKey);

router.get('/', AppController.launchDefault);

module.exports = router;