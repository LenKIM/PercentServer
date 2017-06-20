const pool = require('../config/mysql');

class Request {
    /**
     * 고객이 특정 견적서를 보고 상담을 요청하기
     * (상태와 채택된 견적서 ID 변경)
     * @returns {Promise}
     * @param requestId
     * @param selectedEstimateId
     * @param status
     */
    editRequestStatusByRequestId(requestId, selectedEstimateId, status) {
        return new Promise((resolve, reject) => {
            pool.getConnection().then(conn => {
                var sql = 'UPDATE request SET selected_estimate_id = ?, status = ? WHERE request_id = ?';
                conn.query(sql, [selectedEstimateId, status, requestId]).then(results => {
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
     * 견적서ID로 선택된 견적서에 해당하는 요청서를 쓴
     * 고객의 FCM_TOKEN을 가져온다.
     * @param estimateId
     * @returns {Promise}
     */
    getCustomerTokenByEstimateId(estimateId) {
        return new Promise((resolve, reject) => {
            pool.getConnection().then(conn => {
                var sql = 'SELECT customer.fcm_token FROM customer, request WHERE customer.customer_id = request.customer_id AND request.selected_estimate_id = ?';
                conn.query(sql, [estimateId]).then(results => {
                    pool.releaseConnection(conn);
                    if (results.length === 0) {
                        reject("NO_DATA");
                        return;
                    }
                    resolve(results[0].fcm_token);
                }).catch(err => {
                    pool.releaseConnection(conn);
                    reject("QUERY_ERR");
                })
            }).catch(err => {
                reject("CONNECTION_ERR");
            })
        })
    }

    /**
     * 요청서 상태 변경하기
     * @returns {Promise}
     * @param estimateId
     * @param status
     */
    editRequestStatusByEstimateId(estimateId, status) {
        return new Promise((resolve, reject) => {
            pool.getConnection().then(conn => {
                var sql = 'UPDATE request SET status = ? WHERE selected_estimate_id = ?';
                conn.query(sql, [status, estimateId]).then(results => {
                    pool.releaseConnection(conn);
                    resolve('SUCCESS');
                }).catch(err => {
                    pool.releaseConnection(conn);
                    reject("QUERY_ERR");
                });
            }).catch(err => {
                reject("CONNECTION_ERR");
            });
        });
    }

    finishRequest(requestId, status) {
        return new Promise((resolve, reject) => {
            pool.getConnection().then(conn => {
                const sql = 'UPDATE request SET status = ? WHERE request_id = ?';
                conn.query(sql, [status, requestId]).then(results => {
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
     * 특정 요청서 상세보기
     * @returns {Promise}
     * @param requestId
     */
    getRequestByRequestId(requestId) {
        return new Promise((resolve, reject) => {
            pool.getConnection().then((conn) => {
                var sql = 'SELECT request.request_id, request.customer_id, request.selected_estimate_id, request.loan_type, request.loan_amount, request.scheduled_time, request.overdue_record, request.interest_rate_type, request.loan_period, request.loan_reason, request.register_time, request.start_time, request.end_time, request.extra, request.job_type, request.status, request.region_1, request.region_2, request.region_3, request.apt_name, request.apt_kb_id, request.apt_price, request.apt_size_supply, request.apt_size_exclusive, estimate.estimate_id, estimate.agent_id, estimate.register_time, estimate.item_bank, estimate.item_name, estimate.interest_rate, estimate.repayment_type, estimate.overdue_interest_rate_1, estimate.overdue_interest_rate_2, estimate.overdue_interest_rate_3, estimate.overdue_time_1, estimate.overdue_time_2, estimate.overdue_time_3, estimate.early_repayment_fee, estimate.fixed_loan_amount, customer.*, IF(review.review_id, "true", "false") AS is_reviewed, review.review_id, review.content, review.score, review.register_time AS review_register_time, agent.agent_id, agent.name, agent.photo, agent.company_name FROM request LEFT JOIN estimate ON request.selected_estimate_id = estimate.estimate_id INNER JOIN customer ON request.customer_id = customer.customer_id LEFT JOIN review ON request.request_id = review.request_id LEFT JOIN agent ON estimate.agent_id = agent.agent_id WHERE request.request_id = ?';
                conn.query(sql, [requestId]).then(results => {
                    pool.releaseConnection(conn);
                    if (results.length === 0) {
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
     * 특정 고객의 요청서 목록 불러오기
     * @param customer
     * @returns {Promise}
     */
    getRequestsByCustomerId(customerId, exceptCompletedRequest, limitCount) {
        return new Promise((resolve, reject) => {
            pool.getConnection().then((conn) => {
                let additionalWhere = ' ';
                if (exceptCompletedRequest) {
                    additionalWhere += 'AND STATUS != "대출실행완료"';
                }
                let additionalLimit = ' ';
                if (limitCount) {
                    additionalLimit += 'LIMIT ' + limitCount;
                }

                var sql = 'SELECT count(estimate.estimate_id) AS estimate_count, request.* FROM request LEFT JOIN estimate ON request.request_id = estimate.request_id WHERE request.customer_id = ? ' + additionalWhere + ' GROUP BY request.request_id ORDER BY request.register_time DESC ' + additionalLimit;
                conn.query(sql, [customerId]).then(results => {
                    pool.releaseConnection(conn);
                    if (results.length === 0) {
                        reject("NO_DATA");
                        return;
                    }
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
     * 드로어 레이아웃에서
     * 요청서 상태 및 수 보여주기
     * @param customer
     * @returns {Promise}
     */
    getRequestCountAndStatusByCustomerId(customerId) {
        return new Promise((resolve, reject) => {
            pool.getConnection().then((conn) => {
                var sql = 'SELECT (SELECT count(status) as count FROM request WHERE status = "대출실행완료" AND customer_id = ? ) AS completed_count, (SELECT count(status) as count FROM request WHERE status != "대출실행완료" AND customer_id = ? ) AS uncompleted_count';
                conn.query(sql, [customerId, customerId]).then(results => {
                    pool.releaseConnection(conn);
                    if (results[0].completed_count == 0 && results[0].uncompleted_count == 0) {
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
     * 모집인 아이디에 따라 요청서를 가져온다.
     * @returns {Promise}
     * @param agentId
     */
    getRequestConsultantRequestByStatus(agentId) {
        return new Promise((resolve, reject) => {
            pool.getConnection().then((conn) => {
                const sql = 'select count(estimate.estimate_id) as count, if((select like_request.register_time from like_request  where 1=1  and like_request.agent_id = ? and like_request.request_id = request.request_id), 1, 0) as favorite, request.request_id, request.customer_id, request.selected_estimate_id, request.loan_type, request.loan_amount, request.scheduled_time, request.overdue_record, request.interest_rate_type, request.loan_period, request.loan_reason, request.register_time, request.start_time, request.end_time, request.extra, request.job_type, request.status, request.region_1, request.region_2, request.region_3, request.apt_name, request.apt_kb_id, request.apt_price, request.apt_size_supply, request.apt_size_exclusive, estimate.estimate_id, estimate.agent_id, estimate.item_bank, estimate.item_name, estimate.interest_rate, estimate.repayment_type, estimate.overdue_interest_rate_1, estimate.overdue_interest_rate_2, estimate.overdue_interest_rate_3, estimate.overdue_time_1, estimate.overdue_time_2, estimate.overdue_time_3, estimate.early_repayment_fee, estimate.fixed_loan_amount from request  left join estimate on request.request_id = estimate.request_id where request.status = ? group by request.request_id order by favorite desc, request.register_time desc';
                conn.query(sql, [agentId, '견적접수중']).then((results) => {
                    pool.releaseConnection(conn);

                    if (results.length === 0) {
                        reject("NO_DATA");
                        return;
                    }
                    resolve(results);
                }).catch((err) => {
                    pool.releaseConnection(conn);
                    reject("QUERY_ERR");
                });
            }).catch((err) => {
                reject('CONNECTION_ERR');
            })
        })
    }

    addEstimateIntoRequest(estimate) {
        return new Promise((resolve, reject) => {
            pool.getConnection().then((conn) => {
                const sql = "INSERT INTO estimate (" +
                    "fixed_loan_amount," +
                    "request_id," +
                    "agent_id," +
                    "item_bank," +
                    "item_name," +
                    "interest_rate," +
                    "interest_rate_type," +
                    "repayment_type," +
                    "overdue_interest_rate_1," +
                    "overdue_interest_rate_2," +
                    "overdue_interest_rate_3," +
                    "overdue_time_1," +
                    "overdue_time_2," +
                    "overdue_time_3," +
                    "early_repayment_fee) " +
                    "VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
                conn.query(sql, [
                    estimate.fixedLoanAmount,
                    estimate.requestId,
                    estimate.agentId,
                    estimate.itemBank,
                    estimate.itemName,
                    estimate.interestRate,
                    estimate.interestRateType,
                    estimate.repaymentType,
                    estimate.overdueInterestRate1,
                    estimate.overdueInterestRate2,
                    estimate.overdueInterestRate3,
                    estimate.overdueTime1,
                    estimate.overdueTime2,
                    estimate.overdueTime3,
                    estimate.earlyRepaymentFee
                ]).then((results) => {
                    pool.releaseConnection(conn);

                    if (results.length === 0) {
                        reject('NO_DATA');
                        return;
                    }
                    console.log(estimate.agentId + "가 " + estimate.requestId + "에 대한 견적서 작성 완료");
                    resolve(results);
                }).catch((err) => {
                    pool.releaseConnection(conn);
                    reject("QUERY_ERR");
                });
            }).catch((err) => {
                reject('CONNECTION_ERR');
            });
        })
    }

    /**
     * 한명의 상담가는 단 하나의 견적서만을 작성할 수 있다.
     * @param requestId
     * @param agentId
     * @returns {Promise}
     */
    getRequestConsultantByRequestID(requestId, agentId) {
        return new Promise((resolve, reject) => {
            pool.getConnection().then((conn) => {
                const sql = 'select count(estimate.estimate_id) as estimate_count, (select count(ag.company_name) from agent ag, estimate es where 1=1 and ag.company_name = (select a.company_name from agent a where a.agent_id = ?) and ag.agent_id = es.agent_id and es.request_id = request.request_id group by ag.company_name) as bank_count, if((select like_request.register_time from like_request where 1=1 and like_request.agent_id = ? and like_request.request_id = request.request_id), 1, 0) as favorite, request.request_id, request.customer_id, request.selected_estimate_id, request.loan_type, request.loan_amount, request.scheduled_time, request.overdue_record, request.interest_rate_type, request.loan_period, request.loan_reason, request.register_time, request.start_time, request.end_time, request.extra, request.job_type, request.status, request.region_1, request.region_2, request.region_3, request.apt_name, request.apt_kb_id, request.apt_price, request.apt_size_supply, request.apt_size_exclusive, estimate.estimate_id, estimate.agent_id, estimate.item_bank, estimate.item_name, estimate.interest_rate, estimate.repayment_type, estimate.overdue_interest_rate_1, estimate.overdue_interest_rate_2, estimate.overdue_interest_rate_3, estimate.overdue_time_1, estimate.overdue_time_2, estimate.overdue_time_3, estimate.early_repayment_fee, estimate.fixed_loan_amount from request left join estimate on request.request_id = estimate.request_id where request.request_id = ? group by estimate.request_id';
                conn.query(sql, [agentId, agentId, requestId]).then((results) => {
                    pool.releaseConnection(conn);
                    if (results.length === 0) {
                        reject("NO_DATA");
                        return;
                    }
                    resolve(results[0]);
                }).catch((err) => {
                    pool.releaseConnection(conn);
                    reject('QUERY_ERR');
                });
            }).catch((err) => {
                reject('CONNECTION_ERR');
            })
        })
    }

    getCustomerIdAndToken(requestId) {
        return new Promise((resolve, reject) => {
            pool.getConnection().then((conn) => {
                const sql = 'SELECT cu.customer_id, cu.fcm_token ' +
                    'FROM customer AS cu, request AS req ' +
                    'WHERE cu.customer_id = req.customer_id ' +
                    'AND req.request_id = ?';
                conn.query(sql, [requestId]).then((results) => {
                    pool.releaseConnection(conn);
                    resolve(results)
                }).catch((err) => {
                    pool.releaseConnection(conn);
                    reject('QUERY_ERR');
                })
            }).catch((err) => {
                    reject('CONNECTION_ERR');
                }
            )
        });
    }
}

module.exports = new Request();