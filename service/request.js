const pool = require('../config/mysql');

class Request {
    /**
     * 요청서 상태 변경하기
     * (상태와 채택된 견적서 ID 변경)
     * EX)
     * 1. 고객이 상담 요청
     * 2. 고객이 상담 취소
     * @param request
     * @returns {Promise}
     */
    editRequestStatus(requestId, selectedEstimateId, status) {
        return new Promise((resolve, reject) => {
            pool.getConnection().then(conn => {
                var sql = 'UPDATE request SET selected_estimate_id = ?, status = ? WHERE request_id = ?';
                conn.query(sql, [selectedEstimateId, status, requestId]).then(results => {
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

    ///////////////////////대출모집용///////////////////////////


    // SELECT req.loan_type, req.end_time,
    // req.region_1, req.region_2, req.region_3,
    // req.apt_name,apt_size_supply, req.apt_size_exclusive,
    // req.loan_amount,req.job_type,req.overdue_record, if (isnull(li.request_id), 0, 1)
    // FROM request AS req, like_request AS li, estimate AS es
    // WHERE es.request_id = req.selected_estimate_id AND req.request_id = li.request_id;
    //
    // SELECT count(es.request_id)FROM request AS req, like_request AS li, estimate AS es
    // WHERE es.request_id = req.selected_estimate_id AND req.request_id = li.request_id;

    /**
     *
     * @returns {Promise}
     * @param agentId
     */
    getRequestConsultantRequestByStatus(agentId){
        return new Promise((resolve, reject) => {
            pool.getConnection().then((conn) => {

                const sql = 'select '+
                'count(estimate.estimate_id) as count,' +
                'if((select' +
                    ' like_request.register_time' +
                ' from like_request ' +
                'where 1=1 ' +
                'and like_request.agent_id = ? ' +
                'and like_request.request_id = request.request_id), 1, 0) as favorite, ' +
                'request.*, ' +
                'estimate.* ' +
                'from request, estimate ' +
                'where 1=1 ' +
                'and request.request_id = estimate.request_id ' +
                'group by request.request_id ';

                conn.query(sql, [agentId]).then((results) => {
                    pool.releaseConnection(conn);

                    if(results.length === 0){
                        reject("no data");
                        return;
                    }
                    resolve(results);
                });
            }).catch((err) => {
                reject(err);
            })
        })
    }

    addEstimateIntoRequest(estimate){
        return new Promise((resolve, reject) => {
            pool.getConnection().then((conn) => {

                const sql= "INSERT INTO estimate (request_id, agent_id, item_bank," +
                    "item_name, interest_rate, interest_rate_type, repayment_type, " +
                    "overdue_interest_rate_1, overdue_inertest_rate_2, overdue_inertest_rate_3," +
                    "overdue_time_1,overdue_time_2,overdue_time_3,early_repayment_fee) " +
                    "VALUES ( ?,?,?,?,?,?,?,?,?,?,?,?,?,?)";

                conn.query(sql, [estimate.requestId, estimate.agentId, estimate.itemBank,
                    estimate.itemName, estimate.interestRate, estimate.interestRateType,
                    estimate.repaymentType, estimate.overdueInterestRate01, estimate.overdueInterestRate02,
                    estimate.overdueInterestRate03, estimate.overdueTime01, estimate.overdueTime02, estimate.overdueTime03, estimate.earlyRepaymentFee]).then((results) => {
                    pool.releaseConnection(conn);

                    if(results.length === 0){
                        reject({msg: "No date"});
                        return;
                    }
                    console.log( estimate.agentId +"가 " + estimate.requestId +"에 대한 견적서 작성 완료");
                    resolve(results);
                })
            });
        }).catch((err) => {
            reject(err);
        })
    }

    /**
     * 한명의 상담가는 단 하나의 견적서만을 작성할 수 있다.
     * @param requestId
     * @param agentId
     * @returns {Promise}
     */
    getRequestConsultantByRequestID(requestId, agentId ){
        return new Promise((resolve, reject) => {
            pool.getConnection().then((conn) => {

                const sql =  'select ' +
                'count(estimate.estimate_id) as estimate_count,' +
                    '(select count(ag.company_name)' +
                'from agent ag, estimate es ' +
                'where 1=1 ' +
                'and ag.company_name = (select a.company_name from agent a where a.agent_id = ?) ' +
                'and ag.agent_id = es.agent_id ' +
                'and es.request_id = request.request_id group by ag.company_name ' +
                ') as bank_count, ' +
                'if((select ' +
                    'like_request.register_time ' +
                'from like_request ' +
                'where 1=1 ' +
                'and like_request.agent_id = ? ' +
                'and like_request.request_id = request.request_id), 1, 0 ' +
                ') as favorite, ' +
                'request.*, ' +
                'estimate.* ' +
                'from request, estimate ' +
                'where 1=1 ' +
                'and request.request_id = estimate.request_id ' +
                'and request.request_id = ? ' +
                'group by estimate.request_id;';

                conn.query(sql, [agentId, agentId,requestId]).then((results) => {
                    pool.releaseConnection(conn);

                    if(results.length === 0){
                        reject("no data");
                        return;
                    }

                    resolve(results);
                });
            }).catch((err) => {
                reject(err);
            })
        })
    }

    getCustomerIdAndToken(requestId){
        return new Promise((resolve, reject) => {
            pool.getConnection().then((conn) => {

                const sql = 'SELECT cu.customer_id, cu.fcm_token ' +
                'FROM customer AS cu, request AS req ' +
                'WHERE cu.customer_id = req.customer_id ' +
                'AND req.request_id = ?';

                conn.query(sql, [requestId]).then((results) => {
                    pool.releaseConnection(conn);
                    resolve(results)
                })
            }).catch((err) => {

                reject({err:err});

                }
            )
        })
    }

}


module.exports = new Request();
