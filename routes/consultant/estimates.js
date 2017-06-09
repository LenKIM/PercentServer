const express = require('express');
const router = express.Router();
const estimateService = require('../../service/estimate');
const requestService = require('../../service/request');
const fcm = require('../../config/fcm');

router.route('/estimates')
    .get(getEstimatesByAgentId);

router.route('/estimates/:estimateId')
    .get(getEstimateByEstimateId)
    .put(editRequestStatusByEstimateId);

/**
 * TODO : 필요없는듯
 * 상담사가 고객의 상담 요청을 확인하기.
 * 요청서 상태를 변경하고 해당 고객에게 푸시 보내기.
 * @param req
 * @param res
 * @param next
 * @returns {Promise.<void>}
 */
async function editRequestStatusByEstimateId(req, res, next) {
    const status = req.body.status;
    const estimateId = parseInt(req.params.estimateId);
    if (typeof estimateId !== 'number' || isNaN(estimateId)) {
        next('WRONG_PARAMETERS');
        return;
    }

    try {
        const editResult = await requestService.editRequestStatusByEstimateId(estimateId, status);
        console.log(editResult);
        const customerToken = await requestService.getCustomerTokenByEstimateId(estimateId);
        console.log(customerToken);
        const fcmResult = await fcm.sendNotification(customerToken, "고객님 알려드립니다.", "상담사께서 고객의 상담요청을 받았습니다. 전화번호가 곧 공개됩니다.");
        console.log(fcmResult);
        res.send({msg: "SUCCESS"});
    } catch (e) {
        next(e)
    }
}

/**
 * 상담사 자신이 견적한
 * 견적서 목록보기
 * @param req
 * @param res
 * @param next
 */
async function getEstimatesByAgentId(req, res, next) {
    const agentId = req.query.agentId;

    if(typeof agentId === 'undefined'){
        next('WRONG_PARAMETERS')
        return;
    }


    try {
        const results = await estimateService.getEstimatesByAgentId(agentId);
        res.send({msg: 'SUCCESS', data: results});
    } catch (error) {
        next(error)
    }
}

/**
 * 특정 견적서 상세보기
 * @param req
 * @param res
 * @param next
 */
async function getEstimateByEstimateId(req, res, next) {
    const estimateId = parseInt(req.params.estimateId);
    if (typeof estimateId !== 'number' || isNaN(estimateId)) {
        next('WRONG_PARAMETERS');
        return;
    }

    try {
        const results = await estimateService.getEstimateByEstimateId(estimateId);
        res.send({msg: 'SUCCESS', data: results});
    } catch (error) {
        next(error);
    }
}

module.exports = router;