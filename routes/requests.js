const express = require('express');
const router = express.Router();
const Pager = require('../model/pager');
const Customer = require('../model/customer');
const Request = require('../model/request');
const requestService = require('../service/request');

router.route('/requests')
    .post(writeRequest);

function writeRequest(req, res, next) {
    const body = req.body;
    const request = new Request(
        null,
        body.customerId,
        null,
        body.loanType,
        body.loanAmount,
        body.scheduledTime,
        body.overdueRecord,
        body.interestRateType,
        body.loanPeriod,
        body.loanReason,
        null,
        null,
        null,
        body.extra,
        body.jobType,
        body.status,
        body.region1,
        body.region2,
        body.region3,
        body.aptName,
        body.aptKBId,
        body.aptPrice,
        body.aptSizeSupply,
        body.aptSizeExclusive
    );

    const customer = new Customer(
        body.customerId,
        body.mainBank,
        null,
        null
    );

    // TODO
    requestService.writeRequest(request, customer).then(results => {
        res.send({msg: 'success', status: results});
    }).catch(error => {
        res.send({msg: 'failed'});
    });
}

module.exports = router;
