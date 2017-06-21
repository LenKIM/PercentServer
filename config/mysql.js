/**
 * MySQL Config
 */

var mysql =  require('promise-mysql');

var dbConfig = {
    host : '',
    user : '',
    password : '',
    port : '',
    database : 'hellomoney'
};

var dbPool = mysql.createPool(dbConfig);

module.exports = dbPool;
