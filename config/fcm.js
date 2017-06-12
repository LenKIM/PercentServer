const FCM = require('fcm-node');
const serverKey = 'AAAAniVF9Xs:APA91bG-Bdhj8GKH4o-hTAGBNCUcXay98SVNNxsAC2bs41NLMs9uj9osWbZcQM66Pi-Oi1m4tgZgBFb6rt9W8YFDUZ3C__xANuMNaAGyLusrpmfKtzemkL9oUh0BjtkzVBi4Nalb9Jw2';
const fcm = new FCM(serverKey);

// TODO : 푸시가 안간다고 앞의 작업들이 취소되면 안된다... ㅠ 고쳐야 함.(TRY CATCH)
// NotRegistered 관련 : https://stackoverflow.com/questions/26718115/gcm-error-not-registered
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
            err ? reject('FCM_ERR') : resolve(res);
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
            err ? reject('FCM_ERR') : resolve(res);
        });
    });
}

module.exports = fcm;