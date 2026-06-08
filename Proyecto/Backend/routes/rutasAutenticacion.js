const express = require('express');
const router = express.Router();
const auth = require('../controllers/controladorAutenticacion');

router.post('/login', auth.login);
router.post('/logout', auth.logout);
router.get('/captcha', auth.getCaptcha);
router.post('/register', auth.registerUser);

module.exports = router;
