var express = require('express');
var router = express.Router();
var Estimate = require('../model/esimate');
var estimateService = require('../service/estimate');

router.route('/estimates').post(writeEstimate);
router.route('/estimates/:estimateId').put(editEstimate);

function writeEstimate(req, res, next) {
    // todo : body-parsing
    // var body = req.body;
    // var something = body.something;
    // var estimate = new Estimate();

    estimateService.writeEstimate(estimate).then(results => {
        res.send({msg: 'success', status: results});
    }).catch(error => {
        res.send({msg: 'failed'});
    });
}

function editEstimate(req, res, next) {
    // todo : uri, body-parsing
    // var estimateId = req.params.estimateId;
    // var body = req.body;
    // var something = body.something;
    // var estimate = new Estimate();

    estimateService.editEstimate(estimate).then(results => {
        res.send({msg: 'success', status: results});
    }).catch(error => {
        res.send({msg: 'failed'});
    });
}

module.exports = router;