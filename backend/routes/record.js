const express = require('express');
const router = express.Router();

const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

const { verifyAccess } = require('../middleware/jwtMiddleware');
const recordController = require('../controller/record');

//레코드 정보 저장 라우트
router.post(
  '/saveRecord',
  verifyAccess,
  upload.fields([
    { name: 'foreheadImage', maxCount: 1 },
    { name: 'crownImage', maxCount: 1 }
  ]),
  recordController.saveRecord
)

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
