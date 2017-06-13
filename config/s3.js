// const AWS = require('aws-sdk');
// const pathUtil = require('path');
// const fs = require('fs');
//
// AWS.config.region = 'ap-northeast-2';
// AWS.config.accessKeyId = 'AKIAJYB3QD7X3SVT2YAQ';
// AWS.config.secretAccessKey = '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';
//
// const s3 = new AWS.S3();
// console.log('endpoint : ', s3.endpoint);
// console.log('href', s3.endpoint.href);
//
// const bucketName = 'percent-s3';
//
// const file = './image.jpg';
// const readStream = fs.createReadStream(file);
// const itemKey = 'image.jpg';
// const contentType = 'image/jpg';
//
// const params = {
//     Bucket: bucketName,
//     Key: itemKey,
//     ACL: 'public-read',
//     Body: readStream,
//     ContentType: contentType
// };
//
// params.Key = getItemKey('horororororl');
//
// s3.putObject(params, function (err, data) {
//     if (err) {
//         console.error('S3 PutObject Error', err);
//         throw err;
//     }
//     // 접근 경로
//     var imageUrl = s3.endpoint.href + bucketName + '/' + itemKey; // http, https
//     console.log('File Upload Success : ', imageUrl);
// });
//
//
// s3.listObjects({Bucket: bucketName}, function(err, data) {
//     console.log('== List Object');
//     if ( err ) {
//         console.error('S3 listObjects Error', err);
//         throw err;
//     }
//
//     var items = data.Contents;
//     items.forEach(function(item) {
//         // console.log('item : ', item);
//         const path1 = s3.endpoint.href + '/' + bucketName + '/' + item.Key;
//         const path2 = 'http://' + s3.endpoint.host + '/' + bucketName + '/' + item.Key;
//         console.log('HTTPS url : ', path1);
//         console.log('HTTP url : ', path2);
//     });
// });
//
// function getItemKey(originName) {
//     // 확장자 얻기
//     const extname = pathUtil.extname(originName);
//     console.log("ddsdfd" + extname);
//
//     const now = new Date(); // 날짜를 이용한 파일 이름 생성
//     const itemKey = 'file_' + now.getYear() + now.getMonth() + now.getDay() + now.getHours() + now.getMinutes() + now.getSeconds() + extname;
//     console.log(itemKey);
//     return itemKey;
// }