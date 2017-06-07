const pool = require('../config/mysql');

class Request {
    /**
     * 고객이 특정 견적서를 보고 상담을 요청하기
     * (상태와 채택된 견적서 ID 변경)
     * @param request
     * @returns {Promise}
     */
    editRequestStatusByRequestId(requestId, selectedEstimateId, status) {
        return new Promise((resolve, reject) => {
            pool.getConnection().then(conn => {
                var sql = 'UPDATE request SET selected_estimate_id = ?, status = ? WHERE request_id = ?';
                conn.query(sql, [selectedEstimateId, status, requestId]).then(results => {
                    pool.releaseConnection(conn);
                    resolve(results);
                }).catch(err => {
                    reject("query fail");
                });
            }).catch(err => {
                reject("connection fail");
            });
        });
    }

    /**
     * 견적서ID로 선택된 견적서에 해당하는 요청서를 쓴
     * 고객의 FCM_TOKEN을 가져온다.
     * @param estimateId
     * @returns {Promise}
     */
    getCustomerTokenByEstimateId(estimateId) {
        return new Promise((resolve, reject) => {
            pool.getConnection().then(conn => {
                var sql = 'SELECT customer.fcm_token FROM customer WHERE customer.customer_id = (SELECT customer_id FROM request WHERE selected_estimate_id = ?)';
                conn.query(sql, [estimateId]).then(results => {
                    pool.releaseConnection(conn);
                    if (results.length == 0) {
                        reject("no data");
                        return;
                    }
                    resolve(results[0].fcm_token);
                }).catch(err => {
                    reject("query fail");
                })
            }).catch(err => {
                reject("connection fail");
            })
        })
    }

    /**
     * 상담사가 고객의 상담 요청을 받고
     * 확인하기 ( 상담 중 상태)
     * @param request
     * @returns {Promise}
     */
    editRequestStatusByEstimateId(estimateId, status) {
        return new Promise((resolve, reject) => {
            pool.getConnection().then(conn => {
                var sql = 'UPDATE request SET status = ? WHERE selected_estimate_id = ?';
                conn.query(sql, [status, estimateId]).then(results => {
                    pool.releaseConnection(conn);
                    resolve(results);
                }).catch(err => {
                    reject("query fail");
                });
            }).catch(err => {
                reject("connection fail");
            });
        });
    }

    finishRequest(requestId, status) {
        return new Promise((resolve, reject) => {
            pool.getConnection().then(conn => {
                var sql = 'UPDATE request SET status = ? WHERE request_id = ?';
                conn.query(sql, [status, requestId]).then(results => {
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
     * 요청 다시하기
     * (특정 요청서와 같은 내용의 요청서를
     * 똑같이 하나 더 만들기)
     * @param request
     * @returns {Promise}
     */
    reWriteRequest(request) {
        return new Promise((resolve, reject) => {
            pool.getConnection().then(conn => {
                var sql = 'INSERT INTO request (customer_id, loan_type, loan_amount, scheduled_time, interest_rate_type, job_type, start_time, end_time, status, region_1, region_2, region_3, apt_name, apt_kb_id, apt_price, apt_size_supply, apt_size_exclusive) SELECT customer_id, loan_type, loan_amount, scheduled_time, interest_rate_type, job_type, ?, ?, ?, region_1, region_2, region_3, apt_name, apt_kb_id, apt_price, apt_size_supply, apt_size_exclusive FROM request where request_id = ?';
                conn.query(sql, [
                    request.startTime,
                    request.endTime,
                    request.status,
                    request.requestId
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
     * 요청서 작성하기
     * @param request
     * @returns {Promise}
     */
    writeRequest(request) {
        return new Promise((resolve, reject) => {
            pool.getConnection().then(conn => {
                var sql = 'INSERT INTO request (customer_id, loan_type, loan_amount, scheduled_time, interest_rate_type, job_type, start_time, end_time, status, region_1, region_2, region_3, apt_name, apt_kb_id, apt_price, apt_size_supply, apt_size_exclusive) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
                conn.query(sql, [
                    request.customerId,
                    request.loanType,
                    request.loanAmount,
                    request.scheduledTime,
                    request.interestRateType,
                    request.jobType,
                    request.startTime,
                    request.endTime,
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
                var sql = 'SELECT * FROM request left join estimate on request.selected_estimate_id = estimate.estimate_id WHERE 1=1 AND request.request_id = ?';
                conn.query(sql, [request.requestId]).then(results => {
                    pool.releaseConnection(conn);

                    if (results.length == 0) {
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

                    if (results.length == 0) {
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

                    if (results.length == 0) {
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
