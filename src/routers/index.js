const router = require('express').Router();

const auth = require('./auth_routers');

router.use(auth);

module.exports = router;
