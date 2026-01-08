<<<<<<< Updated upstream:backend/routes/picture.js
=======
const express = require('express');
const router = express.Router();

const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

const recordController = require('../controller/record');

router.post(
    '/forehead',
    upload.single('file'),
    recordController.saveForeheadPicture
);

router.post(
    '/crown',
    upload.single('file'),
    recordController.saveCrownPicture
);

module.exports = router;
>>>>>>> Stashed changes:backend/routes/record.js
