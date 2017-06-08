const express = require('express');
const router = express.Router();
const companyService = require('../../service/company');

router.route('/companies').get(showCompanyList);
router.route('/companies/:companyId').get(showCompanyDetail);

async function showCompanyList(req, res, next) {
    const type = req.query.type;

    try {
        const results = await companyService.getCompanies(type);
        res.send({msg: 'success', total: results.count, data: results.data});
    } catch (error) {
        next(error);
    }
}

async function showCompanyDetail(req, res, next) {
    const companyId = req.params.companyId;

    try {
        const results = await companyService.getCompany(companyId);
        res.send({msg: 'success', data: results});
    } catch (error) {
        next(error);
    }
}

module.exports = router;