const express = require('express');
const router = express.Router();

const faqs = require('./common/faqs');
const notices = require('./common/notices');

router.use(faqs);
router.use(notices);

module.exports = router;
