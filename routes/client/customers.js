const express = require('express');
const router = express.Router();
const Customer = require('../../model/customer');
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
function addCustomer(req, res, next) {
    const body = req.body;
    const customer = new Customer(
        body.customerId,
        null,
        null,
        null,
        null,
        body.fcmToken
    );

    customerService.addCustomer(customer).then(results => {
        res.send({msg: 'success'});
    }).catch(error => {
        next(error);
    });
}

/**
 * UUID로 기등록자인지 확인하기
 * @param req
 * @param res
 * @param next
 */
function getCustomer(req, res, next) {
    const customer = new Customer(
        req.params.customerId
    );

    customerService.getCustomer(customer).then(results => {
        res.send({msg: 'success', data: results});
    }).catch(error => {
        next(error)
    });
}

module.exports = router;
