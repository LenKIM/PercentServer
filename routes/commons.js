const express = require('express');
const router = express.Router();

const faqs = require('./common/faqs');
const notices = require('./common/notices');
const image = require('./common/imageuploader');

router.use(faqs);
router.use(notices);
router.use(image);

module.exports = router;
