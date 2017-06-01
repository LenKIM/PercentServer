const FCM = require('fcm-node');
const serverKey = 'AAAAniVF9Xs:APA91bG-Bdhj8GKH4o-hTAGBNCUcXay98SVNNxsAC2bs41NLMs9uj9osWbZcQM66Pi-Oi1m4tgZgBFb6rt9W8YFDUZ3C__xANuMNaAGyLusrpmfKtzemkL9oUh0BjtkzVBi4Nalb9Jw2';
const fcm = new FCM(serverKey);

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
            err ? reject(err) : resolve(res);
        });
    });
}

module.exports = fcm;