const express = require('express');
const router = express.Router();
const Customer = require('../../model/customer');
const Request = require('../../model/request');
const requestService = require('../../service/request');
const customerService = require('../../service/customer');
const agentService = require('../../service/agent');
const fcm = require('../../config/fcm');
const schedule = require('node-schedule');
const winston = require('winston');

router.route('/requests')
    .get(getRequestsByCustomerId)
    .post(writeRequest);

router.route('/requests/calculate')
    .get(getRequestCountAndStatusByCustomerId);

router.route('/requests/:requestId')
    .get(getRequestByRequestId)
    .put(editRequestStatusByRequestId)
    .post(reWriteRequest);

/**
 * 요청 다시하기
 * (특정 요청서와 같은 내용의 요청서를
 * 똑같이 하나 더 만들기)
 * @param res
 * @param req
 * @param next
 */
async function reWriteRequest(req, res, next) {
    const requestId = parseInt(req.params.requestId);
    if (typeof requestId != 'number' || isNaN(requestId)) {
        next('WRONG_PARAMETERS');
        return;
    }

    // const endTime = getElapsedTimeInOfficeHours(9, 9, 1);

    const request = new Request(
        requestId,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        new Date(),
        endTime,
        null,
        null,
        '견적접수중'
    );

    try {
        const ret1 = await requestService.reWriteRequest(request);
        const insertRequestId = ret1.insertId;
        const ret2 = await requestService.getRequestByRequestId(new Request(insertRequestId));
        const customerId = ret2.customer_id;
        const ret3 = await customerService.getCustomer(new Customer(customerId));
        const customerFCMToken = ret3.fcm_token;
        const agentsFCMTokenArray = agentService.getAgentsToken();
        const ret4 = await fcm.sendMulticastNotification(agentsFCMTokenArray, '새로운 견적요청이 있습니다.', '확인해보세요.');

        winston.log('info', insertRequestId + '번 요청이 ' + endTime + '에 마감됩니다.');
        var j = schedule.scheduleJob(insertRequestId.toString(), endTime, function (token, requestId) {
            fcm.sendNotification(token, "견적등록이 마감되었습니다.", "결과를 확인해보세요.");
            requestService.finishRequest(requestId, '선택대기중');
            winston.log('info', insertRequestId + '번 요청이 ' + endTime + '에 마감되었습니다.');
        }.bind(null, customerFCMToken, insertRequestId));
        res.send({msg: 'SUCCESS'});
    } catch (err) {
        next(err);
    }
}

/**
 * 고객이 특정 견적서를 보고 상담을 요청하기
 * 요청서 상태 변경하기 & 해당되는 모집인에게 푸시보내기
 * (상태와 채택된 견적서 ID 변경)
 * @param req
 * @param res
 * @param next
 */
async function editRequestStatusByRequestId(req, res, next) {
    const body = req.body;
    const requestId = parseInt(req.params.requestId);
    const selectedEstimatedId = parseInt(body.selectedEstimateId);
    const status = '상담중';

    if (typeof requestId !== 'number' || isNaN(requestId) ||
        typeof selectedEstimatedId !== 'number' || isNaN(selectedEstimatedId)) {
        next('WRONG_PARAMETERS');
        return;
    }

    try {
        const editResult = await requestService.editRequestStatusByRequestId(requestId, selectedEstimatedId, status);
        const agentToken = await agentService.getAgentTokenByRequestId(requestId);
        const fcmResult = await fcm.sendNotification(agentToken, "고객이 상담을 요청했습니다.", "확인해보세요.");
        res.send({msg: 'SUCCESS'});
    } catch (error) {
        next(error);
    }
}

/**
 * 특정 요청서 상세보기
 * @param req
 * @param res
 * @param next
 */
async function getRequestByRequestId(req, res, next) {
    const requestId = parseInt(req.params.requestId);
    if (typeof requestId != 'number' || isNaN(requestId)) {
        next('WRONG_PARAMETERS');
        return;
    }

    try {
        const results = await requestService.getRequestByRequestId(requestId);
        console.log(results);
        res.send({msg:'SUCCESS', data: results});
    } catch(error) {
        next(error);
    }
}

/**
 * 메인화면 및 견적서 요청함에서
 * 특정 고객의 요청서 목록 불러오기
 * @param req
 * @param res
 * @param next
 */
async function getRequestsByCustomerId(req, res, next) {
    const customerId = req.query.customerId;
    const exceptCompletedRequest = req.query.exceptCompletedRequest == 'true' ? true : false;
    const limitCount = parseInt(req.query.limitCount) || null;

    try {
        const results = await requestService.getRequestsByCustomerId(customerId, exceptCompletedRequest, limitCount);
        res.send({msg: 'SUCCESS', data: results});
    } catch (error) {
        next(error);
    }
}

/**
 * 드로어 레이아웃에서
 * 특정 고객의 요청서 상태 및 수 보여주기
 * @param req
 * @param res
 * @param next
 */
async function getRequestCountAndStatusByCustomerId(req, res, next) {
    const customerId = req.query.customerId;

    try {
        const results = await requestService.getRequestCountAndStatusByCustomerId(customerId);
        res.send({msg: 'SUCCESS', data: results});
    } catch (error) {
        next(error);
    }
}
/**
 * 요청서 작성하기
 * @param req
 * @param res
 * @param next
 */
async function writeRequest(req, res, next) {
    const body = req.body;
    const customerId = body.customerId;
    const loanAmount = parseInt(body.loanAmount);
    const aptPrice = parseInt(body.aptPrice);

    if (typeof loanAmount !== 'number' || isNaN(loanAmount) ||
        typeof aptPrice !== 'number' || isNaN(aptPrice)) {
        next('WRONG_PARAMETERS');
        return;
    }

    const endTime = getElapsedTimeInOfficeHours(9, 18, 1);

    const request = new Request(
        null,
        customerId,
        null,
        body.loanType,
        loanAmount,
        body.scheduledTime,
        null,
        body.interestRateType,
        null,
        null,
        null,
        new Date(),
        endTime,
        null,
        body.jobType,
        '견적접수중',
        body.region1,
        body.region2,
        body.region3,
        body.aptName,
        body.aptKBId,
        aptPrice,
        body.aptSizeSupply,
        body.aptSizeExclusive
    );

    const customer = new Customer(
        body.customerId,
        body.phoneNumber
    );

    try {
        const ret1 = await requestService.writeRequest(request);
        const ret2 = await customerService.editCustomer(body.customerId, body.phoneNumber);
        const ret3 = await customerService.getCustomer(body.customerId);
        const insertRequestId = ret1.insertId;
        const customerFCMToken = ret3.fcm_token;
        const agentsFCMTokenArray = await agentService.getAgentsToken();
        const ret4 = await fcm.sendMulticastNotification(agentsFCMTokenArray, '새로운 견적요청이 있습니다.', '확인해보세요.');

        winston.log('info', insertRequestId + '번 요청이 ' + endTime + '에 마감됩니다.');
        var j = schedule.scheduleJob(insertRequestId.toString(), endTime, function (token, requestId) {
            fcm.sendNotification(token, "견적등록이 마감되었습니다.", "결과를 확인해보세요.");
            requestService.finishRequest(requestId, '선택대기중');
            winston.log('info', insertRequestId + '번 요청이 ' + endTime + '에 마감되었습니다.');
        }.bind(null, customerFCMToken, insertRequestId));
        res.send({msg: 'SUCCESS'});
    } catch (err) {
        next(err);
    }
}

/**
 * startHour부터 endHour까지 영업시간
 * 현재시간으로부터 elapseHour만큼 뒤의 시간을 반환
 * 영업시간이 아니라면 그 다음날로 넘긴다.
 * CF1) RDS MYSQL PARAMETERS GROUP의 TIME_ZONE을 SEOUL로 바꿔야 한다.
 * CF2) EC2의 TIMEZONE도 한국으로 바꿔야 한다
 * http://ora-sysdba.tistory.com/entry/Cloud-Computing-Amazon-EC2-%EC%9D%B8%EC%8A%A4%ED%84%B4%EC%8A%A4%EC%9D%98-TIMEZONE-%EB%B3%80%EA%B2%BD
 * @param startHour
 * @param endHour
 * @param elapseHour
 * @param callback
 */
function getElapsedTimeInOfficeHours(startHour, endHour, elapseHour) {
    var todayStartTime = new Date();
    todayStartTime.setHours(startHour);
    todayStartTime.setMinutes(0);
    todayStartTime.setSeconds(0);

    var todayEndTime = new Date();
    todayEndTime.setHours(endHour);
    todayEndTime.setMinutes(0);
    todayEndTime.setSeconds(0);

    var todayThresholdTime = todayEndTime;
    todayThresholdTime.setHours(todayThresholdTime.getHours() - elapseHour);

    var tomorrowStartTime = new Date();
    tomorrowStartTime.setDate(tomorrowStartTime.getDate() + 1);
    tomorrowStartTime.setHours(startHour);
    tomorrowStartTime.setMinutes(0);
    tomorrowStartTime.setSeconds(0);

    var currentTime = new Date();
    var ret;

    // 현재시간이 업무 시간 전이면
    // 업무시작시간 3시간 뒤 반환
    // if (currentTime < todayStartTime) {
        ret = currentTime;
        ret.setHours(ret.getHours() + elapseHour);
    // }
    // else if (currentTime >= todayStartTime && currentTime < todayThresholdTime) {
        // 3시간 뒤 시간이 오늘 업무 마감 시간을 넘어서지 않는다면
        // 3시간 뒤 시간을 반환
        // ret = currentTime;

        // ret.setHours(ret.getHours() + elapseHour);
    // } else if (currentTime > todayThresholdTime) {
        // 3시간 뒤 시간이 오늘 업무 마감 시간을 넘어서면
        // 차이만큼을 내일 시작업무시간부터 더해서 반환
        // var diff = todayEndTime.getTime() - currentTime.getTime();
        // ret = tomorrowStartTime.getTime() - diff;
        // ret = new Date(ret);
    // }

    return ret;
}

module.exports = router;
