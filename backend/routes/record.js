const express = require('express');
const router = express.Router();

const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

const recordController = require('../controller/record');

//이마 사진 저장 라우트
router.post(
    '/forehead',
    upload.single('file'),
    recordController.saveForeheadPicture
);

//정수리 사진 저장 라우트
router.post(
    '/crown',
    upload.single('file'),
    recordController.saveCrownPicture
);

module.exports = router;
