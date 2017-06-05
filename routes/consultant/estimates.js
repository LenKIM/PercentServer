const express = require('express');
const router = express.Router();
const estimateService = require('../../service/estimate');

router.route('/estimates')
    .get(getEstimatesByAgentId);

router.route('/estimates/:estimateId')
    .get(getEstimateByEstimateId);

/**
 * 상담사 자신이 견적한
 * 견적서 목록보기
 * @param req
 * @param res
 * @param next
 */
async function getEstimatesByAgentId(req, res, next) {
    const agentId = req.query.agentId;
    try {
        const results = await estimateService.getEstimatesByAgentId(agentId);
        res.send({msg: 'success', data: results});
    } catch (error) {
        res.send({msg: error});
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
    if (typeof estimateId != 'number' || isNaN(estimateId)) {
        res.send({msg: 'wrong parameters'});
        return;
    }

    try {
        const results = await estimateService.getEstimateByEstimateId(estimateId);
        res.send({msg: 'success', data: results});
    } catch (error) {
        res.send({msg: error});
    }
}

module.exports = router;