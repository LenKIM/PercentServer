const pool = require('../config/mysql');

class Customer {
    /**
     * 고객 추가하기
     * @param customer
     * @returns {Promise}
     */
    addCustomer(customerId, fcmToken) {
        return new Promise((resolve, reject) => {
            pool.getConnection().then((conn) => {
                var sql = "INSERT INTO customer (customer_id, fcm_token) VALUES (?, ?)";
                conn.query(sql, [customerId, fcmToken]).then(results => {
                    pool.releaseConnection(conn);
                    resolve(results);
                }).catch(error => {
                    pool.releaseConnection(conn);
                    reject('QUERY_ERR');
                });
            }).catch(error => {
                reject('CONNECTION_ERR');
            });
        });
    }

    /**
     * UUID로 기등록자인지 확인하기
     * @param customer
     * @returns {Promise}
     */
    getCustomer(customerId) {
        return new Promise((resolve, reject) => {
            pool.getConnection().then((conn) => {
                var sql = "SELECT * FROM customer WHERE customer_id = ?";
                conn.query(sql, [customerId]).then(results => {
                    pool.releaseConnection(conn);
                    if(results.length == 0) {
                        reject("NO_DATA");
                        return;
                    }
                    resolve(results[0]);
                }).catch(error => {
                    pool.releaseConnection(conn);
                    reject('QUERY_ERR');
                });
            }).catch(error => {
                reject('CONNECTION_ERR');
            });
        });
    }

    /**
     * 요청서 작성 시
     * 고객 수정하기
     * @param customer
     * @returns {Promise}
     */
    editCustomer(customerId, phoneNumber) {
        return new Promise((resolve, reject) => {
            pool.getConnection().then((conn) => {
                var sql = 'UPDATE customer SET phone_number = ? WHERE customer_id = ?';
                conn.query(sql, [phoneNumber, customerId]).then(results => {
                    pool.releaseConnection(conn);
                    resolve(results);
                }).catch(error => {
                    pool.releaseConnection(conn);
                    reject('QUERY_ERR');
                });
            }).catch(error => {
                reject('CONNECTION_ERR');
            });
        });
    }

    updateCustomerFcmToken(customerId, fcmToken) {
        return new Promise((resolve, reject) => {
            pool.getConnection().then((conn) => {
                var sql = 'UPDATE customer SET fcm_token = ? WHERE customer_id = ?';
                conn.query(sql, [fcmToken, customerId]).then(results => {
                    pool.releaseConnection(conn);
                    resolve(results);
                }).catch(error => {
                    pool.releaseConnection(conn);
                    reject('QUERY_ERR');
                });
            }).catch(error => {
                reject('CONNECTION_ERR');
            });
        });
    }
}

module.exports = new Customer();