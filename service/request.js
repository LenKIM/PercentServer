const pool = require('../config/mysql');

class Request {
    /**
     * 상담 요청하기
     * 1. 상태 변경
     * 2. 견적서 채택
     * @param request
     * @returns {Promise}
     */
    requestConsultation(request) {
        return new Promise((resolve, reject) => {
            pool.getConnection().then(conn => {
                var sql = 'UPDATE request SET selected_estimate_id = ?, status = ? WHERE request_id = ?';
                conn.query(sql, [request.selectedEstimateId, request.status, request.requestId]).then(results => {
                    pool.releaseConnection(conn);
                    resolve(results);
                }).catch(err => {
                    reject("fail");
                });
            }).catch(err => {
                reject(err);
            });
        });
    }

    /**
     * 요청서 작성하기
     * @param request
     * @returns {Promise}
     */
    writeRequest(request) {
        return new Promise((resolve, reject) => {
            pool.getConnection().then(conn => {
                var sql = 'INSERT INTO request (customer_id, loan_type, loan_amount, scheduled_time, interest_rate_type, job_type, status, region_1, region_2, region_3, apt_name, apt_kb_id, apt_price, apt_size_supply, apt_size_exclusive) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
                conn.query(sql, [
                    request.customerId,
                    request.loanType,
                    request.loanAmount,
                    request.scheduledTime,
                    request.interestRateType,
                    request.jobType,
                    request.status,
                    request.region1,
                    request.region2,
                    request.region3,
                    request.aptName,
                    request.aptKBId,
                    request.aptPrice,
                    request.aptSizeSupply,
                    request.aptSizeExclusive
                ]).then(results => {
                    pool.releaseConnection(conn);
                    resolve(results);
                }).catch(err => {
                    reject("fail");
                });
            }).catch(err => {
                reject(err);
            });
        });
    }

    /**
     * 특정 요청서 상세보기
     * @param request
     * @returns {Promise}
     */
    getRequestByRequestId(request) {
        return new Promise((resolve, reject) => {
            pool.getConnection().then((conn) => {
                var sql = 'SELECT * FROM request WHERE request_id = ?';
                conn.query(sql, [request.requestId]).then(results => {
                    pool.releaseConnection(conn);

                    if(results.length == 0) {
                        reject("no data");
                        return;
                    }

                    resolve(results);
                });
            }).catch((err) => {
                reject(err);
            });
        });
    }

    /**
     * 특정 고객의 요청서 목록 불러오기
     * @param customer
     * @returns {Promise}
     */
    getRequestsByCustomerId(customer) {
        return new Promise((resolve, reject) => {
            pool.getConnection().then((conn) => {
                var sql = 'SELECT * FROM request WHERE customer_id = ?';
                conn.query(sql, [customer.customerId]).then(results => {
                    pool.releaseConnection(conn);

                    if(results.length == 0) {
                        reject("no data");
                        return;
                    }

                    resolve(results);
                });
            }).catch((err) => {
                reject(err);
            });
        });
    }

    /**
     * 드로어 레이아웃에서
     * 요청서 상태 및 수 보여주기
     * @param customer
     * @returns {Promise}
     */
    getRequestCountAndStatusByCustomerId(customer) {
        return new Promise((resolve, reject) => {
            pool.getConnection().then((conn) => {
                    var sql = 'SELECT status, count(status) as count FROM request WHERE customer_id = ? group by status';
                conn.query(sql, [customer.customerId]).then(results => {
                    pool.releaseConnection(conn);

                    if(results.length == 0) {
                        reject("no data");
                        return;
                    }

                    resolve(results);
                });
            }).catch((err) => {
                reject(err);
            });
        });
    }
}

module.exports = new Request();
