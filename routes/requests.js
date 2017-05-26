const express = require('express');
const router = express.Router();
const Customer = require('../model/customer');
const Request = require('../model/request');
const requestService = require('../service/request');

router.route('/requests')
    .get(getRequestsByCustomerId)
    .post(writeRequest);

router.route('/requests/calculate')
    .get(getRequestCountAndStatusByCustomerId);

router.route('/requests/:requestId')
    .get(getRequestByRequestId);

router.route('/requests/:requestId/consult')
    .put(requestConsultation);

/**
 * 상담 요청하기
 * 1. 상태 변경
 * 2. 견적서 채택
 * @param req
 * @param res
 * @param next
 */
function requestConsultation(req, res, next) {
    const body = req.body;
    const request = new Request(
        parseInt(req.params.requestId),
        null,
        parseInt(body.selectedEstimateId),
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        body.status
    );

    requestService.requestConsultation(request).then(results => {
        res.send({msg: 'success', status: results});
    }).catch(error => {
        res.send({msg: 'failed'});
    });
}

/**
 * 특정 요청서 상세보기
 * @param req
 * @param res
 * @param next
 */
function getRequestByRequestId(req, res, next) {
    const requestId = parseInt(req.params.requestId);
    const request = new Request(requestId);

    requestService.getRequestByRequestId(request).then(results => {
        res.send({msg: 'success', data: results});
    }).catch(error => {
        res.send({msg: 'failed'});
    });
}

/**
 * 메인화면 및 견적서 요청함에서
 * 특정 고객의 요청서 목록 불러오기
 * @param req
 * @param res
 * @param next
 */
function getRequestsByCustomerId(req, res, next) {
    const customerId = parseInt(req.query.customerId);
    const customer = new Customer(customerId);

    requestService.getRequestsByCustomerId(customer).then(results => {
        res.send({msg: 'success', data: results});
    }).catch(error => {
        res.send({msg: 'failed'});
    });
}

/**
 * 드로어 레이아웃에서
 * 특정 고객의 요청서 상태 및 수 보여주기
 * @param req
 * @param res
 * @param next
 */
function getRequestCountAndStatusByCustomerId(req, res, next) {
    const customerId = parseInt(req.query.customerId);
    const customer = new Customer(customerId);

    requestService.getRequestCountAndStatusByCustomerId(customer).then(results => {
        res.send({msg: 'success', data: results});
    }).catch(error => {
        res.send({msg: 'failed'});
    });
}
/**
 * TODO : 오류난다. 데이터 타입 확인 필요.
 * 요청서 작성하기
 * @param req
 * @param res
 * @param next
 */
function writeRequest(req, res, next) {
    const body = req.body;
    const request = new Request(
        null,
        parseInt(body.customerId),
        null,
        body.loanType,
        parseInt(body.loanAmount),
        body.scheduledTime,
        null,
        body.interestRateType,
        null,
        null,
        null,
        null,
        null,
        null,
        body.jobType,
        body.status,
        body.region1,
        body.region2,
        body.region3,
        body.aptName,
        body.aptKBId,
        parseInt(body.aptPrice),
        parseFloat(body.aptSizeSupply),
        parseFloat(body.aptSizeExclusive)
    );

    /*
     TODO : 이미 저장되어있는 정보라 굳이 필요하지 않을 것 같은데 회의해볼 필요가 있음.
     */
    const customer = new Customer(
        body.customerId,
        body.phoneNumber
    );

    requestService.writeRequest(request).then(results => {
        res.send({msg: 'success', status: results});
    }).catch(error => {
        res.send({msg: 'failed'});
    });
}

module.exports = router;
