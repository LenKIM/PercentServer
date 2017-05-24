/**
 * MySQL Config
 */

var mysql =  require('promise-mysql');

var dbConfig = {
    host : 'localhost',
    user : 'root',
    password : '111111',
    port : '3306',
    database : 'hellomoney'
};

var dbPool = mysql.createPool(dbConfig);

module.exports = dbPool;