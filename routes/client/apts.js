const express = require('express');
const router = express.Router();
const aptService = require('../../service/apt');

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
async function getRegions1(req, res, next) {
    try {
        const results = await aptService.getRegions1();
        res.send({msg:'SUCCESS', data: results});
    } catch(error) {
        next(error);
    }
}

/**
 * 시/군/구 목록 불러오기
 * @param req
 * @param res
 * @param next
 */
async function getRegions2(req, res, next) {
    try {
        const results = await aptService.getRegions2(req.params.region1);
        res.send({msg:'SUCCESS', data: results});
    } catch(error) {
        next(error);
    }
}

/**
 * 읍/면/동 목록 불러오기
 * @param req
 * @param res
 * @param next
 */
async function getRegions3(req, res, next) {
    try {
        const results = await aptService.getRegions3(
            req.params.region1,
            req.params.region2
        );
        res.send({msg:'SUCCESS', data: results});
    } catch(error) {
        next(error);
    }
}

/**
 * 아파트 이름 목록 불러오기
 * @param req
 * @param res
 * @param next
 */
async function getAptNames(req, res, next) {
    try {
        const results = await aptService.getAptNames(
            req.params.region1,
            req.params.region2,
            req.params.region3
        );
        res.send({msg:'SUCCESS', data: results});
    } catch(error) {
        next(error);
    }
}

/**
 * 특정 아파트 정보 목록 불러오기
 * @param req
 * @param res
 * @param next
 */
async function getAptInfo(req, res, next) {
    try {
        const results = await aptService.getAptInfo(
            req.params.region1,
            req.params.region2,
            req.params.region3,
            req.params.aptName
        );
        res.send({msg:'SUCCESS', data: results});
    } catch(error) {
        next(error);
    }
}

module.exports = router;