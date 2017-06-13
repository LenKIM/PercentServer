const FCM = require('fcm-node');
const serverKey = 'AAAAniVF9Xs:APA91bG-Bdhj8GKH4o-hTAGBNCUcXay98SVNNxsAC2bs41NLMs9uj9osWbZcQM66Pi-Oi1m4tgZgBFb6rt9W8YFDUZ3C__xANuMNaAGyLusrpmfKtzemkL9oUh0BjtkzVBi4Nalb9Jw2';
const fcm = new FCM(serverKey);
const winston = require('winston');

// NotRegistered 관련 : https://stackoverflow.com/questions/26718115/gcm-error-not-registered
// TODO : 앱을 지웠다 깔면 토큰을 업데이트 하거나 지우게
FCM.prototype.sendNotification = function (targetToken, notiTitle, notiBody) {
    const message = {
        to: targetToken,
        notification: {
            title: notiTitle,
            body: notiBody
        }
    };

    return new Promise((resolve, reject) => {
        fcm.send(message, (err, res) => {
            if(err) {
                winston.log('info', 'FCM SEND NOTIFICATION ERROR : ' + err);
            }
            resolve(res);
        });
    });
};

FCM.prototype.sendMulticastNotification = function (targetTokens, notiTitle, notiBody) {
    const message = {
        registration_ids: targetTokens,
        notification: {
            title: notiTitle,
            body: notiBody
        }
    };

    return new Promise((resolve, reject) => {
        fcm.send(message, (err, res) => {
            if(err) {
                winston.log('info', 'FCM SEND MULTICAST NOTIFICATION ERROR :' + err);
            }
            resolve(res);
        });
    });
}

module.exports = fcm;