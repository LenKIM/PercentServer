const pool = require('../config/mysql');

class Customer {
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