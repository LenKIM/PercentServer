const pool = require('../config/mysql');

class Customer {
    /**
     * 고객 추가하기
     * @param customer
     * @returns {Promise}
     */
    addCustomer(customer) {
        return new Promise((resolve, reject) => {
            pool.getConnection().then((conn) => {
                const sql = "INSERT INTO customer (customer_id, fcm_token) VALUES (?, ?)";
                conn.query(sql, [customer.customerId, customer.fcmToken]).then(results => {
                    pool.releaseConnection(conn);
                    resolve(results);
                }).catch(error => {
                    reject("fail to insert userInfo" + "detailed : " +error);
                });
            }).catch(error => {
                reject(error);
            });
        });
    }

    /**
     * UUID로 기등록자인지 확인하기
     * @param customer
     * @returns {Promise}
     */
    getCustomer(customer) {
        return new Promise((resolve, reject) => {
            pool.getConnection().then((conn) => {
                const sql = "SELECT * FROM customer WHERE customer_id = ?";
                conn.query(sql, [customer.customerId]).then(results => {
                    pool.releaseConnection(conn);

                    if(results.length === 0) {
                        reject("There is no data");
                        return;
                    }

                    resolve(results);
                });
            }).catch(error => {
                reject(error);
            });
        });
    }

    /**
     * 요청서 작성 시
     * 고객 수정하기
     * @param customer
     * @returns {Promise}
     */
    editCustomer(customer) {
        return new Promise((resolve, reject) => {
            pool.getConnection().then((conn) => {
                const sql = 'UPDATE customer SET phone_number = ? WHERE customer_id = ?';
                conn.query(sql, [customer.phoneNumber, customer.customerId]).then(results => {
                    pool.releaseConnection(conn);
                    resolve(results);
                }).catch(error => {
                    reject("fail to edit customerInfo");
                });
            }).catch(error => {
                reject(error);
            });
        });
    }
}

module.exports = new Customer();