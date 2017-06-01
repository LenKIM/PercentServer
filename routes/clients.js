const express = require('express');
const router = express.Router();

const agents = require('./client/agents');
const apts = require('./client/apts');
const customers = require('./client/customers');
const estimates = require('./client/estimates');
const requests = require('./client/requests');
const reviews = require('./client/reviews');

router.use(agents);
router.use(apts);
router.use(customers);
router.use(estimates);
router.use(requests);
router.use(reviews);

module.exports = router;
