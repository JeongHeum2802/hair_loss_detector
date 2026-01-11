const express = require('express');
const router = express.Router();

const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

const {verifyAccess} = require('../middleware/jwtMiddleware');
const recordController = require('../controller/record');

//이마 사진 저장 라우트
router.post(
    '/forehead',
    verifyAccess,
    upload.single('file'),
    recordController.saveForeheadPicture
);

//정수리 사진 저장 라우트
router.post(
    '/crown',
    verifyAccess,
    upload.single('file'),
    recordController.saveCrownPicture
);

//유저 레코드 조회 라우트
router.get(
    '/viewRecords',
    verifyAccess,
    recordController.sendRecord
);

//유저 레코드 삭제
router.delete(
    '/deleteRecord',
    verifyAccess,
    recordController.deleteRecord
);

module.exports = router;
