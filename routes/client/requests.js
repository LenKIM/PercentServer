const express = require('express');
const router = express.Router();
const Customer = require('../../model/customer');
const Request = require('../../model/request');
const requestService = require('../../service/request');
const customerService = require('../../service/customer');
const agentService = require('../../service/agent');
const fcm = require('../../config/fcm');

router.route('/requests')
    .get(getRequestsByCustomerId)
    .post(writeRequest);

router.route('/requests/:requestId')
    .get(getRequestByRequestId)
    .put(editRequestStatus)
    .post(reWriteRequest);

router.route('/requests/calculate')
    .get(getRequestCountAndStatusByCustomerId);

/**
 * 요청 다시하기
 * (특정 요청서와 같은 내용의 요청서를
 * 똑같이 하나 더 만들기)
 * @param res
 * @param req
 * @param next
 */
function reWriteRequest(req, res, next) {
    const status = req.body.status;
    const requestId = parseInt(req.params.requestId);
    if (typeof requestId != 'number' || isNaN(requestId)) {
        res.send({msg: 'wrong parameters'});
        return;
    }

    const request = new Request(
        requestId,
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
        null,
        null,
        status
    );

    requestService.reWriteRequest(request).then(results => {
        res.send({msg: 'success'});
    }).catch(error => {
        res.send({msg: error});
    });
}

/**
 * 요청서 상태 변경하기 & 해당되는 모집인에게 푸시보내기
 * (상태와 채택된 견적서 ID 변경)
 * EX)
 * 1. 고객이 상담 요청
 * 2. 고객이 상담 취소
 * @param req
 * @param res
 * @param next
 */
async function editRequestStatus(req, res, next) {
    const body = req.body;
    const requestId = parseInt(req.params.requestId);
    const selectedEstimatedId = parseInt(body.selectedEstimateId);
    const status = body.status;

    if (typeof requestId != 'number' || isNaN(requestId) ||
        typeof selectedEstimatedId != 'number' || isNaN(selectedEstimatedId)) {
        res.send({msg: 'wrong parameters'});
        return;
    }

    try {
        const editResult = await requestService.editRequestStatus(requestId, selectedEstimatedId, status);
        console.log(editResult);
        const agentToken = await agentService.getAgentTokenByRequestId(requestId);
        const fcmResult = await fcm.sendNotification(agentToken, "상담사님, 알려드립니다.",requestId+"번 요청서가 " + status + " 상태가 되었습니다.");
        console.log(fcmResult);
        res.send({msg: 'success'});
    } catch (err) {
        res.send({msg: err});
    }
}

/**
 * 특정 요청서 상세보기
 * @param req
 * @param res
 * @param next
 */
function getRequestByRequestId(req, res, next) {
    const requestId = parseInt(req.params.requestId);
    if (typeof requestId != 'number' || isNaN(requestId)) {
        res.send({msg: 'wrong parameters'});
        return;
    }

    const request = new Request(requestId);

    requestService.getRequestByRequestId(request).then(results => {
        res.send({msg: 'success', data: results});
    }).catch(error => {
        res.send({msg: error});
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
    const customer = new Customer(req.query.customerId);

    requestService.getRequestsByCustomerId(customer).then(results => {
        res.send({msg: 'success', data: results});
    }).catch(error => {
        res.send({msg: error});
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
    const customer = new Customer(req.query.customerId);

    requestService.getRequestCountAndStatusByCustomerId(customer).then(results => {
        res.send({msg: 'success', data: results});
    }).catch(error => {
        res.send({msg: error});
    });
}
/**
 * 요청서 작성하기
 * @param req
 * @param res
 * @param next
 */
async function writeRequest(req, res, next) {
    const body = req.body;
    const customerId = body.customerId;
    const loanAmount = parseInt(body.loanAmount);
    const aptPrice = parseInt(body.aptPrice);
    const aptSizeSupply = parseFloat(body.aptSizeSupply);
    const aptSizeExclusive = parseFloat(body.aptSizeExclusive);

    if (typeof loanAmount != 'number' || isNaN(loanAmount) ||
        typeof aptPrice != 'number' || isNaN(aptPrice) ||
        typeof aptSizeSupply != 'number' || isNaN(aptSizeSupply) ||
        typeof aptSizeExclusive != 'number' || isNaN(aptSizeExclusive)) {
        res.send({msg: 'wrong parameters'});
        return;
    }

    const request = new Request(
        null,
        customerId,
        null,
        body.loanType,
        loanAmount,
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
        aptPrice,
        aptSizeSupply,
        aptSizeExclusive
    );

    const customer = new Customer(
        body.customerId,
        body.phoneNumber
    );

    // TODO : 트랜잭션
    try {
        const ret1 = await requestService.writeRequest(request);
        const ret2 = await customerService.editCustomer(customer);
        res.send({msg: 'success'});
    } catch (err) {
        console.log(err);
    }
}

module.exports = router;