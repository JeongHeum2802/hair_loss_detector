const express = require('express');

const router = express.Router();

const userController = require('../controller/user');

//회원가입
router.post('/signUp', userController.signUp);

//로그인
router.post('/logIn', userController.logIn);

//이메일 발송
router.post('/sendEmailCode', userController.sendEmailCode);

//코드 비교
router.post('/verify_email', userController.verifyEmailCode);

//회원 탈퇴 (인증 필요)
const { verifyAccess } = require('../middleware/jwtMiddleware');
router.post('/deleteUser', verifyAccess, userController.deleteUser);

module.exports = router;