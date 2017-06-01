const express = require('express');
const router = express.Router();
const Estimate = require('../../model/esimate');
const Request = require('../../model/request');
const estimateService = require('../../service/estimate');

router.route('/estimates')
    .get(getEstimatesByRequestId);
// .post(writeEstimate);

router.route('/estimates/calculate')
    .get(getEstimatesCountAndAvgInterest);

router.route('/estimates/:estimateId')
    .get(getEstimateByEstimateId);
// .put(editEstimate);

/**
 * 요청서 상세 화면에서
 * 모집된 견적수와 평균 금리 불러오기
 * @param req
 * @param res
 * @param next
 */
function getEstimatesCountAndAvgInterest(req, res, next) {
    const requestId = parseInt(req.query.requestId);
    if (typeof requestId != 'number' || isNaN(requestId)) {
        res.send({msg: 'wrong parameters'});
        return;
    }

    const request = new Request(requestId);

    estimateService.getEstimatesCountAndAvgInterest(request).then(results => {
        res.send({msg: 'success', data: results});
    }).catch(error => {
        res.send({msg: error});
    });
}

/**
 * 요청서 상세 화면에서
 * 모집된 견적서 목록보기
 * @param req
 * @param res
 * @param next
 */
function getEstimatesByRequestId(req, res, next) {
    const requestId = parseInt(req.query.requestId);
    if (typeof requestId != 'number' || isNaN(requestId)) {
        res.send({msg: 'wrong parameters'});
        return;
    }

    const request = new Request(requestId);

    estimateService.getEstimatesByRequestId(request).then(results => {
        res.send({msg: 'success', data: results});
    }).catch(error => {
        res.send({msg: error});
    });
}

/**
 * 요청서 상세 화면에서
 * 모집된 견적서 목록 중
 * 특정 견적서 상세보기
 * @param req
 * @param res
 * @param next
 */
function getEstimateByEstimateId(req, res, next) {
    const estimateId = parseInt(req.params.estimateId);
    if (typeof estimateId != 'number' || isNaN(estimateId)) {
        res.send({msg: 'wrong parameters'});
        return;
    }

    const estimate = new Estimate(estimateId);

    estimateService.getEstimateByEstimateId(estimate).then(results => {
        res.send({msg: 'success', data: results});
    }).catch(error => {
        res.send({msg: error});
    });
}

/*
 function writeEstimate(req, res, next) {
 const body = req.body;
 const estimate = new Estimate(
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
 const body = req.body;
 const estimate = new Estimate(
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
 } */

module.exports = router;