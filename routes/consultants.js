const express = require('express');
const router = express.Router();

const agents = require('./consultant/agents');
const companies = require('./consultant/companies');
const items = require('./consultant/items');
const likes = require('./consultant/likes');

router.use(agents);
router.use(companies);
router.use(likes);
router.use(items);

module.exports = router;
