/**
 * Created by len on 2017. 6. 6..
 * 컨설턴드가 어떤 요청서에 대한 견적성을 작성하는 부분
 */
const express = require('express');
const router = express.Router();
const requestService = require('../../service/request');
const Estimate = require('../../model/estimate');
const fcm = require('../../config/fcm');
const schedule = require('node-schedule');




// router.route('/requests/calculate')
//     .get(getCalculatedRequestCountByStatus);


router.route('/requests/agent/:agentId')
    .get(getRequests)
    .post(setRequest);

router.route('/requests/:requestId/:agentId')
    .get(getRequestByRequestId);


// async function getCalculatedRequestCountByStatus(req, res, next) {
//
//     const agentId = req.body.agentId;
//
//     try {
//         const results =  await requestService.getRequestConsultantRequestByStatus(agentId);
//             res.send({msg: 'success', data: results});
//         }catch (err){
//             res.send({err : err})
//     }
// }

async function setRequest(req, res, next) {

    const agentId = req.params.agentId;
    const body = req.body;

    const estimate = new Estimate(
        null,
        body.fixedLoanAmount,
        body.requestId,
        agentId,
        null,
        body.itemBank,
        body.itemName,
        body.interestRate,
        body.interestRateType,
        body.repaymentType,
        body.overdueInterestRate1,
        body.overdueInterestRate2,
        body.overdueInterestRate3,
        body.overdueTime1,
        body.overdueTime2,
        body.overdueTime3,
        body.earlyRepaymentFee
    );

    try {
        const addResults = await requestService. addEstimateIntoRequest(estimate);
        const countRequest = await requestService.getRequestConsultantByRequestID(body.requestId, agentId);
        const customer = await requestService.getCustomerIdAndToken(body.requestId);
        if(countRequest.estimate_count >= 1 && countRequest.estimate_count < 10) {

            if (customer[0].fcm_token.length == 0) {
                next('NO_FCM_TOKEN');
                return;
            }
            const result = await fcm.sendNotification(customer[0].fcm_token, '새 대출견적이 등록되었습니다.', " 확인해보세요.");
            // FCM 없을 때 반환 NULL로 되고
            // 아래와 같은 에러 발생함
            /*
             info: FCM SEND NOTIFICATION ERROR :
             {"multicast_id":5775297949462949018,"success":0,"failure":1,"canonical_ids":0,"results":[{"error":"InvalidRegistration"}]}
             */
            console.log(result);
            console.log(customer[0].customer_id + "에게" + "토큰 번호 :" + customer[0].fcm_token + "으로 " + countRequest.estimate_count + "개 알림 전송 완료");

            res.send({msg: 'SUCCESS'});

        }else if(countRequest.estimate_count == 10) {

            if (customer[0].fcm_token.length === 0) {
                next('NO_FCM_TOKEN');
                return;
            }

            await fcm.sendNotification(customer[0].fcm_token, '견적등록이 마감되었습니다.', '결과를 확인해보세요.');
            console.log(customer[0].customer_id + "에게" + "토큰 번호 :" + customer[0].fcm_token + "으로 10개 알림 전송 완료");

            requestService.finishRequest(body.requestId, "견적마감");
            console.log(customer[0].customer_id + "에 대한 " + '견적마감');

            const scheduled = schedule.scheduledJobs;
            if (scheduled[body.requestId.toString()] !== null)
                scheduled[body.requestId.toString()].cancel();
            res.send({msg: 'SUCCESS'});
        } else {
            next('ESTIMATE_COUNT_EXCEED');
        }
    } catch (err){
        next(err);
    }
}

async function getRequests(req, res, next) {
    const agentId = req.params.agentId;

    try {
        const results = await requestService.getRequestConsultantRequestByStatus(agentId);
        res.send({ msg : 'SUCCESS', data: results});
    }catch (err){
        next(err)
    }
}

async function getRequestByRequestId(req, res, next) {
    const requestId = req.params.requestId;
    const agentId = req.params.agentId;

    try {
        const results = await requestService.getRequestConsultantByRequestID(requestId, agentId);
        res.send({msg: 'SUCCESS', data : results})
    }catch (err){
        next(err)
    }
}

module.exports = router;