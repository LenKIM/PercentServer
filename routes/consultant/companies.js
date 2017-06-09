var express = require('express');
var router = express.Router();
var Company = require('../../model/company');
var companyService = require('../../service/company');

router.route('/companies').get(showCompanyList);
router.route('/companies/:companyId').get(showCompanyDetail);

function showCompanyList(req, res, next) {
    var type = req.query.type;
    var company = new Company(null, null, type);

    companyService.getCompanies(company).then(results => {
        res.send({msg: 'SUCCESS', total: results.count, data: results.data});
    }).catch(error => {
        next(error);
    });
}

function showCompanyDetail(req, res, next) {
    var companyId = req.params.companyId;
    var company = new Company(companyId);

    companyService.getCompany(company).then(results => {
        res.send({msg: 'SUCCESS', data: results});
    }).catch(error => {
        next(error)
    });
}

module.exports = router;