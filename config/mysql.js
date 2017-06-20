/**
 * MySQL Config
 */

var mysql =  require('promise-mysql');

var dbConfig = {
    host : 'hellomoney2.cj0dugpahfcd.ap-northeast-2.rds.amazonaws.com',
    user : 'root',
    password : 'hello1234',
    port : '3306',
    database : 'hellomoney'
};

var dbPool = mysql.createPool(dbConfig);

module.exports = dbPool;