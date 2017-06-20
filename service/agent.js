const pool = require('../config/mysql');

class Agent {
    /**
     * 모집인 ID로 후기 목록 불러오기
     * @returns {Promise}
     * @param agentId
     */
    getReviewsByAgentId(agentId) {
        return new Promise((resolve, reject) => {
            pool.getConnection().then((conn) => {
                const sql = 'SELECT IFNULL(0.01*estimate.fixed_loan_amount * ((SELECT AVG(es.interest_rate) - MIN(es.interest_rate) FROM estimate es, request rq WHERE es.request_id = rq.request_id AND rq.request_id = request.request_id)),0) AS benefit, estimate.*, request.*, review.* FROM estimate, request, review WHERE estimate.estimate_id = request.selected_estimate_id AND request.request_id = review.request_id AND estimate.agent_id = ?';
                conn.query(sql, [agentId]).then(results => {
                    pool.releaseConnection(conn);
                    if(results.length == 0) {
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
     * 대출 모집인 상세 정보 불러오기
     * @returns {Promise}
     * @param agentId
     */
    getAgentByAgentId(agentId) {
        return new Promise((resolve, reject) => {
            pool.getConnection().then((conn) => {
                const sql = 'SELECT * FROM agent WHERE agent_id = ?';
                conn.query(sql, [agentId]).then(results => {
                    pool.releaseConnection(conn);
                    if(results.length == 0) {
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
     * 요청서의 선택된 견적서를 작성한 모집인 토큰 가져오기
     * @returns {Promise}
     * @param requestId
     */
    getAgentTokenByRequestId(requestId) {
        return new Promise((resolve, reject) => {
            pool.getConnection().then((conn) => {
                const sql = 'SELECT agent.fcm_token FROM estimate, request, agent WHERE request.selected_estimate_id = estimate.estimate_id AND estimate.agent_id = agent.agent_id AND request.request_id = ?';
                conn.query(sql, [requestId]).then(results => {
                    pool.releaseConnection(conn);
                    if(results.length === 0) {
                        reject("NO_FCM_TOKEN");
                        return;
                    }
                    resolve(results[0].fcm_token);
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
     * 상담사의 아이디를 통해 토큰을 가져오기
     * @param agentId
     * @returns {Promise}
     */
    getAgentTokenByAgentID(agentId) {
        return new Promise((resolve, reject) => {
            pool.getConnection().then((conn) => {
                const sql = 'SELECT agent.fcm_token FROM agent WHERE agent_id = ?';
                conn.query(sql, [agentId]).then(results => {
                    pool.releaseConnection(conn);
                    if(results.length === 0) {
                        reject("NO_FCM_TOKEN");
                        return;
                    }
                    resolve(results[0].fcm_token);
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
     * 모든 상담사의 토큰 가져오기
     * 배열을 프로미스로 반환
     * @returns {Promise}
     */
    getAgentsToken() {
        return new Promise((resolve, reject) => {
            pool.getConnection().then((conn) => {
                const sql = 'SELECT agent.fcm_token FROM agent';
                conn.query(sql).then(results => {
                    pool.releaseConnection(conn);
                    if(results.length === 0) {
                        reject("NO_FCM_TOKEN");
                        return;
                    }
                    let ret = [];
                    results.forEach((result) => {
                        ret.push(result.fcm_token);
                    });
                    resolve(ret);
                }).catch((err) => {
                    pool.releaseConnection(conn);
                    reject('QUERY_ERR');
                });
            }).catch((err) => {
                reject('CONNECTION_ERR');
            });
        });
    }
}

module.exports = new Agent();