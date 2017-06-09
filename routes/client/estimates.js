const express = require('express');
const router = express.Router();
const estimateService = require('../../service/estimate');

router.route('/estimates')
    .get(getEstimatesByRequestId);

router.route('/estimates/:estimateId')
    .get(getEstimateByEstimateId);

/**
 * 요청서 상세 화면에서
 * 모집된 견적서 목록보기
 * @param req
 * @param res
 * @param next
 */
async function getEstimatesByRequestId(req, res, next) {
    const requestId = parseInt(req.query.requestId);
    if (typeof requestId !== 'number' || isNaN(requestId)) {
        next('WRONG_PARAMETERS');
        return;
    }

    try {
        const results = await estimateService.getEstimatesByRequestId(requestId);
        res.send({msg:'SUCCESS', data: results});
    } catch(error) {
        next(error);
    }
}

/**
 * 요청서 상세 화면에서
 * 모집된 견적서 목록 중
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
        res.send({msg:'SUCCESS', data: results});
    } catch(error) {
        next(error);
    }
}

module.exports = router;