const express = require('express');
const router = express.Router();
const Customer = require('../model/customer');
const customerService = require('../service/customer');

router.route('/customers').post(addCustomer);
router.route('/customers/:customerId').get(getCustomer);

/**
 * 고객 추가하기
 * @param req
 * @param res
 * @param next
 */
function addCustomer(req, res, next) {
    const body = req.body;
    const customer = new Customer(
        null,
        body.phoneNumber,
        null,
        null,
        null
    );

    customerService.addCustomer(customer).then(results => {
        res.send({msg: 'success', status: results});
    }).catch(error => {
        res.send({msg: 'failed'});
    });
}

/**
 * 전화번호로 기등록자인지 확인하기
 * @param req
 * @param res
 * @param next
 */
function getCustomer(req, res, next) {
    const customer = new Customer(
        null,
        req.params.phoneNumber,
        null,
        null,
        null
    );

    customerService.getCustomer(customer).then(results => {
        res.send({msg: 'success', data: results});
    }).catch(error => {
        res.send({msg: 'failed'});
    });
}

module.exports = router;
