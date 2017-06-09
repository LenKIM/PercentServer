const express = require('express');
const router = express.Router();
const customerService = require('../../service/customer');

router.route('/customers')
    .post(addCustomer);

router.route('/customers/:customerId')
    .get(getCustomer);

/**
 * 고객 추가하기
 * UUID와 FCM 토큰 추가
 * @param req
 * @param res
 * @param next
 */
async function addCustomer(req, res, next) {
    try {
        const addResult = await customerService.addCustomer(req.body.customerId, req.body.fcmToken);
        res.send({msg:'SUCCESS'});
    } catch(error) {
        next(error);
    }
}

/**
 * UUID로 기등록자인지 확인하기
 * @param req
 * @param res
 * @param next
 */
async function getCustomer(req, res, next) {
    try {
        const results = await customerService.getCustomer(req.params.customerId)
        res.send({msg:'SUCCESS', data: results});
    } catch(error) {
        next(error);
    }
}

module.exports = router;
