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
                    const sql = 'SELECT re.content, re.score, re.register_time, ' +
                                'req.region_1, req.region_2, req.region_3, req.apt_name, req.apt_size_supply, req.apt_size_exclusive, req.loan_amount, ' +
                                'req.overdue_record, req.interest_rate_type, req.why_lean, req.job_type, req.scheduled_time, req.extra' +
                                'FROM review AS re, request AS req, estimate AS es, agent AS ag WHERE re.request_id = req.request_id and req.selected_estimate_id = es.estimate_id and es.agent_id = ag.agent_id and ag.agent_id = ? LIMIT ? OFFSET ?';
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
     * todo : 보여줄 데이터가 더 있지 않나?
     * 상세 리뷰 보기
     * @param review
     * @returns {Promise.<T>}
     */
    getReviewByReviewId(review) {
        return new Promise((resolve, reject) => {
            pool.getConnection().then((conn) => {
                const sql = 'SELECT review.content, review.score, review.register_time ' +
                            'request. FROM review, request, estimate, agent WHERE review.request_id = request.request_id and request.selected_estimate_id = estimate.estimate_id and estimate.agent_id = agent.agent_id and review.review_id = ?';
                conn.query(sql, [review.reviewId]).then(results => {
                    pool.releaseConnection(conn);
                    resolve(results);
                });
            }).catch((err) => {
                reject(err);
            });
        });
    }
}

module.exports = new Review();