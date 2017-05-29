const express = require('express');
const router = express.Router();
const Customer = require('../model/customer');
const customerService = require('../service/customer');

router.route('/customers')
    .get(getCustomer)
    .post(addCustomer);

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
        res.send({msg: 'success'});
    }).catch(error => {
        res.send({msg: error});
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
        req.query.phoneNumber,
        null,
        null,
        null
    );

    customerService.getCustomer(customer).then(results => {
        res.send({msg: 'success', data: results});
    }).catch(error => {
        res.send({msg: error});
    });
}

module.exports = router;
