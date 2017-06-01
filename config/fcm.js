const FCM = require('fcm-node');
const serverKey = 'AAAAniVF9Xs:APA91bG-Bdhj8GKH4o-hTAGBNCUcXay98SVNNxsAC2bs41NLMs9uj9osWbZcQM66Pi-Oi1m4tgZgBFb6rt9W8YFDUZ3C__xANuMNaAGyLusrpmfKtzemkL9oUh0BjtkzVBi4Nalb9Jw2';
const fcm = new FCM(serverKey);

module.exports = fcm;