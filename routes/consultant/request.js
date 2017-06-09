/**
 * Created by len on 2017. 6. 6..
 */
const express = require('express');
const router = express.Router();
const requestService = require('../../service/request');
const Estimate = require('../../model/esimate');
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
        body.requestId,
        agentId,
        null,
        body.itemBank,
        body.itemName,
        body.interestRate,
        body.interestRateType,
        body.repaymentType,
        body.overdueInterestRate01,
        body.overdueInterestRate02,
        body.overdueInterestRate03,
        body.overdueTime01,
        body.overdueTime02,
        body.overdueTime03,
        body.earlyRepaymentFee
    );

    try {
        await requestService.addEstimateIntoRequest(estimate);
        const countRequest = await requestService.getRequestConsultantByRequestID(body.requestId, agentId);
        const customer = await requestService.getCustomerIdAndToken(body.requestId);

        if(countRequest[0].estimate_count >= 1 && countRequest[0].estimate_count < 10) {
            if (customer[0].fcm_token.length === 0) {
                next('NO_FCM_TOKEN');
                return;
            }
            await fcm.sendNotification(customer[0].fcm_token, '견적서 알림', "현재 견적서가" + countRequest[0].estimate_count + "개 입니다.");
            console.log(customer[0].customer_id + "에게" + "토큰 번호 :" + customer[0].fcm_token + "으로 " + countRequest[0].estimate_count + "개 알림 전송 완료");

            res.send('SUCCESS');

        }else if(countRequest[0].estimate_count === 10) {

            if (customer[0].fcm_token.length === 0) {
                next('NO_FCM_TOKEN');
                return;
            }

            await fcm.sendNotification(customer[0].fcm_token, '견적서 알림', '현재 견적서가 10개로 마감되었습니다.');
            console.log(customer[0].customer_id + "에게" + "토큰 번호 :" + customer[0].fcm_token + "으로 10개 알림 전송 완료");

            requestService.finishRequest(body.requestId, "견적마감");
            console.log(customer[0].customer_id + "에 대한 " + '견적마감');

            const scheduled = schedule.scheduledJobs;
            if (scheduled[body.requestId.toString()] !== null)
                scheduled[body.requestId.toString()].cancel();
            res.send(`SUCCESS`);
        }
        // } else {
        // res.send({ msg : 'success', data: addEstimate});
        // }

    } catch (err){
        next(err)
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
    //TODO 클라이언트단에서 만약 갯수가 2개면 안보인다고 말하기.
    try {
        const results = await requestService.getRequestConsultantByRequestID(requestId, agentId);
        res.send({msg: 'SUCCESS', data : results})
    }catch (err){
        next(err)
    }
}

module.exports = router;