const express = require('express');

const router = express.Router();

const userController = require('../controller/user');

//회원가입
router.post('/signIn', userController.signIn);

//로그인
router.post('/logIn', userController.logIn);

//이메일 발송
router.post('/sendEmailCode', userController.sendEmailCode);

//코드 비교
router.post('/verify_email', userController.verifyEmailCode);

module.exports = router;