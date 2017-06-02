const schedule = require('node-schedule');

var date = new Date();
// date.setHours(date.getHours() + 3);
date.setSeconds(date.getSeconds() + 2);
var id = 1001;
var x = 'Tada!';
var j = schedule.scheduleJob(id.toString(), date, function (y) {
    console.log(y); // This will log 'Tada!'
}.bind(null, x));
x = 'Changing Data';

// var scheduled = schedule.scheduledJobs;
// if (scheduled[id.toString()] != null)
//     scheduled[id.toString()].cancel();

// 업무시간이 초과되면 익일 3시간 뒤 시간을 구하는 함수
function except(startTime, endTime, afterTime) {
    
}
