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
                var sql = "INSERT INTO customer (customer_id) VALUES (?)";
                conn.query(sql, [
                    customer.customerId,
                    customer.customerId
                ]).then(results => {
                    pool.releaseConnection(conn);
                    resolve(results);
                });
            }).catch(error => {
                reject(error);
            });
        });
    }

    /**
     * 전화번호로 기등록자인지 확인하기
     * @param customer
     * @returns {Promise}
     */
    getCustomer(customer) {
        return new Promise((resolve, reject) => {
            pool.getConnection().then((conn) => {
                var sql = "SELECT * FROM customer WHERE customer_id = ?";
                conn.query(sql, [customer.customerId]).then(results => {
                    pool.releaseConnection(conn);
                    resolve(results);
                });
            }).catch(error => {
                reject(error);
            });
        });
    }
}

module.exports = new Customer();