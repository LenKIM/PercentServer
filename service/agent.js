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
                const sql = 'SELECT * FROM estimate, request, review WHERE estimate.estimate_id = request.selected_estimate_id AND request.request_id = review.request_id AND estimate.agent_id = ?';
                conn.query(sql, [agent.agentId]).then(results => {
                    pool.releaseConnection(conn);
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
                    resolve(results);
                });
            }).catch((err) => {
                reject(err);
            });
        });
    }
}

module.exports = new Agent();