var express = require('express');
var router = express.Router();
var Company = require('../model/company');
var companyService = require('../service/company');

router.route('/companies').get(showCompanyList);
router.route('/companies/:companyId').get(showCompanyDetail);

function showCompanyList(req, res, next) {
    var type = req.query.type;
    var company = new Company(null, null, type);

    companyService.getCompanies(company).then(results => {
        res.send({msg: 'success', total: results.count, data: results.data});
    }).catch(error => {
        res.send({msg: 'failed'});
    });
}

function showCompanyDetail(req, res, next) {
    var companyId = req.params.companyId;
    var company = new Company(companyId);

    companyService.getCompany(company).then(results => {
        res.send({msg: 'success', data: results});
    }).catch(error => {
        res.send({msg: 'failed'});
    });
}

module.exports = router;