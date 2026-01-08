const express = require('express');

const router = express.Router();

const userController = require('../controller/user');

router.post('/signIn', userController.signIn);
router.post('/logIn', userController.logIn);

module.exports = router;