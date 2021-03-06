const pool = require('../config/mysql');

/**
 * Review Service
 */
class Review {
    /**
     * 리뷰 작성하기
     * @param review
     * @returns {Promise}
     */
    addReview(requestId, content, score) {
        return new Promise((resolve, reject) => {
            pool.getConnection().then((conn) => {
                const sql = 'INSERT INTO review (request_id, content, score) VALUES (?,?,?)';
                conn.query(sql, [requestId, content, score]).then(results => {
                    pool.releaseConnection(conn);
                    resolve(results);
                }).catch(err => {
                    pool.releaseConnection(conn);
                    reject('QUERY_ERR');
                });
            }).catch((err) => {
                reject('CONNECTION_ERR');
            });
        });
    }

    /**
     * 메인화면 리뷰 목록 불러오기
     * @param pager
     * @returns {Promise}
     */

    getReviews(page, count, keyword) {
        return new Promise((resolve, reject) => {
            pool.getConnection().then((conn) => {
                const countSql = 'SELECT COUNT(*) as count FROM estimate, request, review, agent WHERE estimate.estimate_id = request.selected_estimate_id AND request.request_id = review.request_id AND estimate.agent_id = agent.agent_id ORDER BY review.register_time DESC';
                conn.query(countSql).then(results => {
                    const totalCount = parseInt(results[0].count);
                    const maxPage = Math.floor(totalCount / count);
                    const offset = count * (page - 1 );
                    const AvrSql = 'SELECT IFNULL(0.01 * estimate.fixed_loan_amount * ((SELECT AVG(es.interest_rate) - MIN(es.interest_rate) FROM estimate es, request rq WHERE es.request_id = rq.request_id AND rq.request_id = request.request_id)) , 0) AS benefit, estimate.estimate_id, estimate.item_bank, estimate.item_name, estimate.interest_rate, estimate.interest_rate_type, estimate.repayment_type, estimate.overdue_interest_rate_1, estimate.overdue_interest_rate_2, estimate.overdue_interest_rate_3, estimate.overdue_time_1, estimate.overdue_time_2, estimate.overdue_time_3, request.request_id, request.selected_estimate_id, request.loan_type, request.loan_amount, request.scheduled_time, request.overdue_record, request.loan_period, request.loan_reason, request.start_time, request.end_time, request.extra, request.job_type, request.status, request.region_1, request.region_2, request.region_3, request.apt_name, request.apt_kb_id, request.apt_price, request.apt_size_supply, request.apt_size_exclusive, review.review_id, review.content, review.score, review.register_time, agent.agent_id, agent.password, agent.name, agent.photo, agent.greeting, agent.company_name, agent.register_number, agent.fcm_token FROM estimate, request, review, agent WHERE 1=1 AND estimate.estimate_id = request.selected_estimate_id AND request.request_id = review.request_id AND estimate.agent_id = agent.agent_id ORDER BY review.register_time DESC LIMIT ? OFFSET ?';
                    conn.query(AvrSql, [count, offset]).then(results => {
                        pool.releaseConnection(conn);
                        if (results.length === 0) {
                            reject('NO_DATA');
                            return;
                        }
                        const paging = {
                            total: totalCount,
                            maxPage: maxPage,
                            page: page,
                            count: count
                        };
                        resolve({
                            paging: paging,
                            data: results
                        });
                    }).catch((err) => {
                        pool.releaseConnection(conn);
                        reject("QUERY_ERR")
                    });
                }).catch((err) => {
                    pool.releaseConnection(conn);
                    reject("QUERY_ERR")
                });
                ;
            }).catch((err) => {
                reject('CONNECTION_ERR');
            });
        });
    }

    /**
     *
     * 특정 대출 모집인에 대한 리뷰 목록 불러오기
     * @param agent
     * @param pager
     * @returns
     *
     */
    getReviewByAgent(agent, pager) {
        return new Promise((resolve, reject) => {

            pool.getConnection().then((conn) => {
                const countSql = 'SELECT count(*) AS count FROM review, request, estimate, agent WHERE review.request_id = request.request_id and request.selected_estimate_id = estimate.estimate_id and estimate.agent_id = agent.agent_id and agent.agent_id = ?';
                conn.query(countSql, [agent.agentId]).then(results => {

                    const totalCount = parseInt(results[0].count);
                    const maxPage = Math.floor(totalCount / pager.count);
                    const offset = pager.count * (pager.page - 1 );

                    const sql = 'SELECT ag.name, ag.company_name, ag.register_number,' +
                        'req.loan_type, re.content, re.score, re.register_time, req.loan_period,' +
                        'req.region_1, req.region_2, req.region_3, req.apt_name, req.apt_size_supply, req.apt_size_exclusive, req.loan_amount, ' +
                        'req.overdue_record, req.interest_rate_type, req.loan_reason, req.job_type, req.scheduled_time, req.extra ' +
                        'FROM review AS re, request AS req, estimate AS es, agent AS ag WHERE re.request_id = req.request_id and req.selected_estimate_id = es.estimate_id and es.agent_id = ag.agent_id and ag.agent_id = ? LIMIT ? OFFSET ?';

                    console.log(sql);
                    conn.query(sql, [agent.agentId, pager.count, offset]).then(results => {
                        pool.releaseConnection(conn);
                        const paging = {
                            total: totalCount,
                            maxPage: maxPage,
                            page: pager.page,
                            count: pager.count
                        };

                        resolve({
                            paging: paging,
                            data: results
                        });
                    });
                }).catch((err) => {
                    pool.releaseConnection(conn);
                    reject('QUERY_ERR')
                });
            }).catch((err) => {
                reject('CONNECTION_ERR');
            });
        });
    }

    /**
     *
     * Review_id에 의한 모든 리뷰 정보 목록 가져오기
     * @returns {Promise.<T>}
     * @param reviewId
     */
    getReviewsByReviewId(reviewId) {
        return new Promise((resolve, reject) => {
            pool.getConnection().then((conn) => {
                const sql = 'SELECT review.*, estimate.*, request.*, agent.* FROM estimate, request, review, agent WHERE estimate.estimate_id = request.selected_estimate_id AND request.request_id = review.request_id AND estimate.agent_id = agent.agent_id AND review.review_id = ?';
                conn.query(sql, [reviewId]).then(results => {
                    pool.releaseConnection(conn);
                    if (results.length === 0) {
                        reject('NO_DATA');
                        return;
                    }
                    resolve(results[0]);
                }).catch((err) => {
                    pool.releaseConnection(conn);
                    reject('QUERY_ERR');
                });
            }).catch((err) => {
                reject('CONNECTION_ERR');
            });
        });
    }

    /**
     * review_id에 의해
     * 모집된 견적 수 및 평균 금리 불러오기
     * @param review
     * @returns {Promise}
     */
    getEstimatesCountAndAverageInterests(reviewId) {
        return new Promise((resolve, reject) => {
            pool.getConnection().then((conn) => {
                const countAndAvr = 'SELECT COUNT(estimate.estimate_id) AS count, AVG(estimate.interest_rate) AS average FROM estimate, request, review WHERE estimate.request_id = request.request_id AND request.request_id = review.request_id AND review.review_id = ?';
                conn.query(countAndAvr, [reviewId]).then(results => {
                    pool.releaseConnection(conn);
                    if (results.length === 0) {
                        reject('NO_DATA');
                        return;
                    }
                    resolve(results[0]);
                }).catch((err) => {
                    pool.releaseConnection(conn);
                    reject('QUERY_ERR');
                });
            }).catch((err) => {
                reject('CONNECTION_ERR');
            });
        })
    }


    /**
     * 리뷰 상세 불러오기
     *
     */
    getReviewDetailed(review) {
        return new Promise((resolve, reject) => {
            pool.getConnection().then((conn) => {
                const sql = 'SELECT ag.name, ag.company_name, ag.register_number,' +
                    'req.region_1, req.region_2, req.region_3, req.loan_type,' +
                    're.content, re.score, re.register_time ' +
                    'FROM request AS req, agent AS ag, review AS re, estimate AS es ' +
                    'WHERE re.request_id = req.request_id and req.selected_estimate_id = es.request_id and es.agent_id = ag.agent_id ' +
                    'and re.review_id = ?';

                conn.query(sql, [review.reviewId]).then(results => {
                    pool.releaseConnection(conn);
                    resolve({
                        data: results
                    });
                }).catch((err) => {
                    pool.releaseConnection(conn);
                    reject('QUERY_ERR');
                });
            }).catch((err) => {
                reject('CONNECTION_ERR');
            });
        });
    }

    /**
     * request_id에 해당하는 상담사 정보 불러오기
     * @param request
     * @returns {Promise}
     */
    getReviewByRequestId(request) {
        return new Promise((resolve, reject) => {
            pool.getConnection().then((conn) => {
                const sql = 'SELECT agent.* FROM request, estimate, agent WHERE request.selected_estimate_id = estimate.estimate_id AND estimate.agent_id = agent.agent_id AND request.request_id = ?';
                conn.query(sql, [request.requestId]).then(results => {
                    pool.releaseConnection(conn);
                    if (results.length === 0) {
                        reject('NO_DATA');
                        return;
                    }
                    resolve(results[0]);
                }).catch(err => {
                    pool.releaseConnection(conn);
                    reject('QUERY_ERR');
                });
            }).catch((err) => {
                reject('CONNECTION_ERR');
            })
        })
    }

    getEstimatesInterestByReviewId(reviewId) {
        return new Promise((resolve, reject) => {
            pool.getConnection().then((conn) => {
                const sql = 'SELECT estimate.interest_rate FROM estimate, request, review WHERE estimate.request_id = request.request_id AND request.request_id = review.request_id AND review.review_id = ?';
                conn.query(sql, [reviewId]).then(results => {
                    pool.releaseConnection(conn);
                    if (results.length === 0) {
                        reject('NO_DATA');
                        return;
                    }
                    resolve(results);
                }).catch(err => {
                    pool.releaseConnection(conn);
                    reject('QUERY_ERR');
                });
            }).catch((err) => {
                reject('CONNECTION_ERR');
            });
        });
    }
}

module.exports = new Review();