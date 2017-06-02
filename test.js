const schedule = require('node-schedule');

// 등록
// 취소
// 로그

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

var current = new Date();
console.log(current);

// 업무시간 :
var todayEndTime = new Date();
todayEndTime.setHours(18);
todayEndTime.setMinutes(0);
todayEndTime.setSeconds(0);


// 현재시간 / 3시간뒤 시간

console.log(todayEndTime.toDateString() + " " + todayEndTime.toTimeString());

