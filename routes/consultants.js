const express = require('express');
const router = express.Router();

const agents = require('./consultant/agents');
const companies = require('./consultant/companies');
const estimates = require('./consultant/estimates');
const items = require('./consultant/items');
const likes = require('./consultant/likes');
const request = require('./consultant/request');

router.use(agents);
router.use(companies);
router.use(estimates);
router.use(likes);
router.use(items);
router.use(request);

module.exports = router;
