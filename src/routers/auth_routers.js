const router = require('express').Router();
const { login, register, me } = require('../controllers/auth_controller');
const authValidation = require('../middleware/validations/auth_validation');
const { tokenCheck } = require('../middleware/auth');

router.post('/login', authValidation.login, login);

router.post('/register', authValidation.register, register);

router.get('/me', tokenCheck, me);

module.exports = router;
