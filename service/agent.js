const pool = require('../config/mysql');

class Agent {
    /**
     * 모집인 ID로 후기 목록 불러오기
     * @param agent
     * @returns {Promise}
     */
    getReviewsByAgentId(agent) {
        return new Promise((resolve, reject) => {
            pool.getConnection().then((conn) => {
                const sql = 'SELECT request.loan_amount * ((SELECT AVG(es.interest_rate) FROM estimate es, request rq WHERE es.request_id = rq.request_id AND rq.request_id = request.request_id) - (SELECT es.interest_rate FROM estimate es, request rq WHERE es.estimate_id = rq.selected_estimate_id AND rq.request_id = request.request_id)) AS benefit, estimate.*, request.*, review.* FROM estimate, request, review WHERE estimate.estimate_id = request.selected_estimate_id AND request.request_id = review.request_id AND estimate.agent_id = ?';
                conn.query(sql, [agent.agentId]).then(results => {
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
     * 대출 모집인 상세 정보 불러오기
     * @param agent
     * @returns {Promise}
     */
    getAgentByAgentId(agent) {
        return new Promise((resolve, reject) => {
            pool.getConnection().then((conn) => {
                const sql = 'SELECT * FROM agent WHERE agent_id = ?';
                conn.query(sql, [agent.agentId]).then(results => {
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
     * 요청서의 선택된 견적서를 작성한 모집인 토큰 가져오기
     * @param agent
     * @returns {Promise}
     */
    getAgentTokenByRequestId(requestId) {
        return new Promise((resolve, reject) => {
            pool.getConnection().then((conn) => {
                const sql = 'SELECT agent.fcm_token FROM estimate, request, agent WHERE request.selected_estimate_id = estimate.estimate_id AND estimate.agent_id = agent.agent_id AND request.request_id = ?';
                conn.query(sql, [requestId]).then(results => {
                    pool.releaseConnection(conn);

                    if(results.length == 0) {
                        reject("no proper fcm token");
                        return;
                    }

                    resolve(results[0].fcm_token);
                });
            }).catch((err) => {
                reject(err);
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
                        reject("no proper fcm token");
                        return;
                    }
                    console.log(results);
                    resolve(results[0].fcm_token);
                });
            }).catch((err) => {
                reject(err);
            });
        });
    }
}

module.exports = new Agent();