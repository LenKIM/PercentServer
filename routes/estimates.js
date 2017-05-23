var express = require('express');
var router = express.Router();
var Estimate = require('../model/esimate');
var estimateService = require('../service/estimate');

router.route('/estimates').post(writeEstimate);
router.route('/estimates/:estimateId').put(editEstimate);

function writeEstimate(req, res, next) {
    var body = req.body;
    var estimate = new Estimate(
        null,
        body.requestId,
        body.agentId,
        null,
        body.itemBank,
        body.itemName,
        body.interestRate,
        body.interestRateType,
        body.repaymentType,
        body.overdueInterestRate1,
        body.overdueInterestRate2,
        body.overdueInterestRate3,
        body.overdueTime1,
        body.overdueTime2,
        body.overdueTime3,
        body.earlyRepaymentFee
    );

    estimateService.writeEstimate(estimate).then(results => {
        res.send({msg: 'success', status: results});
    }).catch(error => {
        res.send({msg: 'failed'});
    });
}

function editEstimate(req, res, next) {
    var body = req.body;
    var estimate = new Estimate(
        req.params.estimateId,
        body.requestId,
        body.agentId,
        null,
        body.itemBank,
        body.itemName,
        body.interestRate,
        body.interestRateType,
        body.repaymentType,
        body.overdueInterestRate1,
        body.overdueInterestRate2,
        body.overdueInterestRate3,
        body.overdueTime1,
        body.overdueTime2,
        body.overdueTime3,
        body.earlyRepaymentFee
    );

    estimateService.editEstimate(estimate).then(results => {
        res.send({msg: 'success', status: results});
    }).catch(error => {
        res.send({msg: 'failed'});
    });
}

module.exports = router;