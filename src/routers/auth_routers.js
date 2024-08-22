const router = require('express').Router();
const { login, register } = require('../controllers/auth_controller');
const authValidation = require('../middleware/validations/auth_validation');

router.post('/login', login);

router.post('/register', authValidation.register, register);

module.exports = router;
