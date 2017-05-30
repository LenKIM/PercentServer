const express = require('express');
const router = express.Router();
const Apt = require('../model/apt');
const aptService = require('../service/apt');

router.route('/apts/regions1/')
    .get(getRegions1);

router.route('/apts/regions1/:region1/regions2')
    .get(getRegions2);

router.route('/apts/regions1/:region1/regions2/:region2/regions3')
    .get(getRegions3);

router.route('/apts/regions1/:region1/regions2/:region2/regions3/:region3/aptNames')
    .get(getAptNames);

router.route('/apts/regions1/:region1/regions2/:region2/regions3/:region3/aptNames/:aptName')
    .get(getAptInfo);

/**
 * 시/도 목록 불러오기
 * @param req
 * @param res
 * @param next
 */
function getRegions1(req, res, next) {
    aptService.getRegions1().then(results => {
        res.send({msg: 'success', data: results});
    }).catch(error => {
        res.send({msg: error});
    });
}

/**
 * 시/군/구 목록 불러오기
 * @param req
 * @param res
 * @param next
 */
function getRegions2(req, res, next) {
    const apt = new Apt(null, req.params.region1);
    aptService.getRegions2(apt).then(results => {
        res.send({msg: 'success', data: results});
    }).catch(error => {
        res.send({msg: error});
    });
}

/**
 * 읍/면/동 목록 불러오기
 * @param req
 * @param res
 * @param next
 */
function getRegions3(req, res, next) {
    const apt = new Apt(null, req.params.region1, req.params.region2);
    aptService.getRegions3(apt).then(results => {
        res.send({msg: 'success', data: results});
    }).catch(error => {
        res.send({msg: error});
    });
}

/**
 * 아파트 이름 목록 불러오기
 * @param req
 * @param res
 * @param next
 */
function getAptNames(req, res, next) {
    const apt = new Apt(null, req.params.region1, req.params.region2, req.params.region3);
    aptService.getAptNames(apt).then(results => {
        res.send({msg: 'success', data: results});
    }).catch(error => {
        res.send({msg: error});
    });
}

/**
 * 특정 아파트 정보 목록 불러오기
 * @param req
 * @param res
 * @param next
 */
function getAptInfo(req, res, next) {
    const apt = new Apt(null, req.params.region1, req.params.region2, req.params.region3, req.params.aptName);
    aptService.getAptInfo(apt).then(results => {
        res.send({msg: 'success', data: results});
    }).catch(error => {
        res.send({msg: error});
    });
}

module.exports = router;