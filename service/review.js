const pool = require('../config/mysql');
/**
 * todo : 테스트
 * Review Service
 */
class Review {
    /**
     * 리뷰 작성하기
     * @param review
     * @returns {Promise}
     */
    addReview(review) {
        return new Promise((resolve, reject) => {
            pool.getConnection().then((conn) => {
                const sql = 'INSERT INTO review (request_id, content, score) VALUES (?,?,?)';
                conn.query(sql, [review.requestId, review.content, review.score]).then(results => {
                    pool.releaseConnection(conn);
                    resolve(results);
                }).catch(err => {
                    reject(err);
                });
            });
        });
    }

    /**
     * 메인화면 리뷰 목록 불러오기
     * @param pager
     * @returns {Promise}
     */
    getReviews(pager) {
        return new Promise((resolve, reject) => {
            pool.getConnection().then((conn) => {

                const countSql = 'SELECT count(*) FROM review';
                conn.query(countSql).then(results => {

                    const totalCount = parseInt(results[0].count);
                    const maxPage = Math.floor(totalCount / pager.count);
                    const offset = pager.count * (pager.page - 1 );

                    const sql = 'SELECT * FROM review LIMIT ? OFFSET ?';
                    conn.query(sql, [pager.count, offset]).then(results => {
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
                });
            }).catch((err) => {
                reject(err);
            });
        });
    }

    /**
     *
     * 특정 대출 모집인에 대한 리뷰 목록 불러오기
     * @param agent
     * @param pager
     * @returns { 아파트,사이즈,금액,연체이력,고정금리,대출사유,직업,대출, 실행 예정일
     *              }
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

                    //대출 request 정보와 리뷰 정보를 보여줌.
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
                });
            }).catch((err) => {
                reject(err);
            });
        });
    }

    /**
     *
     * Request_id에 의한 모든 리뷰 정보 목록 가져오기
     * @param review
     * @param pager
     * @returns {Promise.<T>}
     */
    getReviewsByReviewId(review, pager) {
        return new Promise((resolve, reject) => {
            pool.getConnection().then((conn) => {
                const countSql = 'SELECT count(*) AS count FROM review, request, estimate, agent ' +
                    'WHERE review.request_id = request.request_id and request.selected_estimate_id = estimate.estimate_id and estimate.agent_id = agent.agent_id and review.review_id = ?';
                conn.query(countSql, [review.reviewId]).then(results => {

                    const totalCount = parseInt(results[0].count);
                    const maxPage = Math.floor(totalCount / pager.count);
                    const offset = pager.count * (pager.page - 1 );

                    //대출 request 정보와 리뷰 정보를 보여줌.
                    const sql = 'SELECT ag.name, ag.company_name, ag.register_number,' +
                        'req.loan_type, re.content, re.score, re.register_time, req.loan_period,' +
                        'req.region_1, req.region_2, req.region_3, req.apt_name, req.apt_size_supply, req.apt_size_exclusive, req.loan_amount, ' +
                        'req.overdue_record, req.interest_rate_type, req.loan_reason, req.job_type, req.scheduled_time, req.extra ' +
                        'FROM review AS re, request AS req, estimate AS es, agent AS ag WHERE re.request_id = req.request_id and req.selected_estimate_id = es.estimate_id and es.agent_id = ag.agent_id and re.review_id = ? LIMIT ? OFFSET ?';
                        console.log(sql);
                    conn.query(sql, [review.reviewId, pager.count, offset]).then(results => {
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
                });
            }).catch((err) => {
                reject(err);
            });
        });
    }
    // getAllReviews(review, pager){
    //     return new Promise((resolve, reject) => {
    //         pool.getConnection().then((conn) => {
    //             const countAllReviews = 'SELECT count(*) AS count FROM review';
    //             conn.query(countAllReviews).then(results => {
    //
    //                 const totalCount = parseInt(results[0].count);
    //                 const maxPage = Math.floor(totalCount / pager.count);
    //                 const offset = pager.count * (pager.page - 1 );
    //
    //                 const sql = 'SELECT * FROM review LIMIT ? OFFSET ?';
    //                 conn.query(sql, [pager.count, offset]).then(results => {
    //                     const paging = {
    //                         total: totalCount,
    //                         maxPage: maxPage,
    //                         page: pager.page,
    //                         count: pager.count
    //                     };
    //
    //                     resolve({
    //                         paging:paging,
    //                         data: results
    //                     });
    //                 });
    //             });
    //         }).catch((err) => {
    //             reject(err);
    //         });
    //     });
    // };

    /**
     * 모집된 견적 수 및 평균 금리 불러오기
     */
    getEstimateCountAndAvrRate(review){
        return new Promise((resolve, reject) => {
            pool.getConnection().then((conn) => {
                const countAndAvr = 'SELECT count(es.estimate_id), avg(es.interest_rate)' +
                                    'FROM request AS req, estimate AS es, review AS re ' +
                                    'WHERE req.selected_estimate_id = es.estimate_id and re.request_id = req.request_id and re.review_id = ?';

                conn.query(countAndAvr, [review.reviewId]).then(results => {
                    resolve({
                        data: results
                        });
                    });
                }).catch((err) =>
            {
                    reject(err);
            });
        })
    }


    /**
     * 리뷰 상세 불러오기
     */

    getReviewDetailed(review){
        return new Promise((resolve, reject) => {
            pool.getConnection().then((conn) => {
                const sql = 'SELECT ag.name, ag.company_name, ag.register_number,' +
                            'req.region_1, req.region_2, req.region_3, req.loan_type,' +
                            're.content, re.score, re.register_time ' +
                            'FROM request AS req, agent AS ag, review AS re, estimate AS es ' +
                            'WHERE re.request_id = req.request_id and req.selected_estimate_id = es.request_id and es.agent_id = ag.agent_id ' +
                            'and re.review_id = ?';

                conn.query(sql,[review.reviewId]).then(results => {
                    resolve({
                        data: results
                    });
                });
            }).catch((err) => {
                    reject(err);
                })
        })
    }

}

module.exports = new Review();