const express = require('express');
const router = express.Router();
const Customer = require('../model/customer');
const customerService = require('../service/customer');

router.route('/customers').post(addCustomer);
router.route('/customers/:customerId').get(getCustomer);

function addCustomer(req, res, next) {
    const body = req.body;
    const customer = new Customer(
        body.customerId,
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

function getCustomer(req, res, next) {
    const customer = new Customer(
        req.params.customerId,
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
