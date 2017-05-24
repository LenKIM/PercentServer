const express = require('express');
const router = express.Router();
const Pager = require('../model/pager');
const Customer = require('../model/customer');
const Request = require('../model/request');
const requestService = require('../service/request');

router.route('/requests')
    .get(getRequests)
    .post(writeRequest);
router.route('/requests/:requestId/customers/:customerId').get();
router.route('/requests/:requestId/estimates/:estimateId').put();
router.route('/requests/:requestId/status/:status').put();

function getRequests(req, res, next) {
    const page = parseInt(req.query.page) || 1;
    const count = parseInt(req.query.count) || 30;
    const pager = new Pager(page, count, null);
    const request = new Request()
}

function showNoticeList(req, res, next) {

    var keyword = req.query.keyword;
    var pager = new Pager(page, count, keyword);

    noticeService.getNotices(pager).then(results => {
        res.send({msg: 'success', paging : results.paging, data: results.data});
    }).catch(error => {
        res.send({msg: 'failed'});
    });
}

function writeRequest(req, res, next) {
    
    // 요청서 작성, 고객은행 업데이트...
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
        null,
        null,
        null,
        body.extra,
        body.jobType,
        body.status,////
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
        null,
        body.mainBank,
        null,
        null
    );

    requestService.writeRequest(request, customer).then(results => {
        res.send({msg: 'success', status: results});
    }).catch(error => {
        res.send({msg: 'failed'});
    });
}

module.exports = router;
