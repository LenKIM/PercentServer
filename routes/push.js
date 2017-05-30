const express = require('express');
const router = express.Router();

const FCM = require('fcm-node');
const serverKey = 'firebase_settings_cloudmessaging_severkey'; //put your server key here
const fcm = new FCM(serverKey);

const message = {

    // 단일 대상으로 보내게끔 되어있음.
    // 우리가 푸시가 필요한 경우는 요청서 상태가 바뀌는 기능 마다
    // 그렇다면 customer db에 토큰도 저장해야한다.
    to: 'fg9wuQbqBoc:APA91bGSlmEX0isMf-u5JM9T5UKSfR-GQpFDMDvFjn3htkRrhUD_g7GIjdL_CPwqoBPupwkBsuV3PIlIqEDr8KE1ABSGgux8JEyBDq1MEmS7uXbodsSOwvU5fzbQDjzrBU1bD8tQSF2T',
    // to: 'registration_token',
    // collapse_key: 'your_collapse_key',

    notification: {
        title: 'My Title, Title of your push notification',
        body: 'My Body, Body of your push notification'
    },

    data: {  //you can send only notification or only data(or include both)
        my_key: 'my value',
        my_another_key: 'my another value',
        message: 'working good?',
    }
};

router.route('/push')
    .get(tryFCM);

function tryFCM(req, res, next) {
    fcm.send(message, function(err, response){
        if (err) {
            console.log(err);
            console.log("Something has gone wrong!");
            res.send("ERROR");
        } else {
            console.log("Successfully sent with response: ", response);
            res.send("OK");
        }
    });
}

module.exports = router;
