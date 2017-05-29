const pool = require('../config/mysql');

class Login {
    /**
     * ID/PW로 대출모집인 있는지 확인
     * @param agent
     * @returns {Promise}
     */
    tryLogin(agent) {
        return new Promise((resolve, reject) => {
            pool.getConnection().then((conn) => {
                const sql = 'SELECT * FROM agent WHERE agent_id = ? AND password = ?';
                conn.query(sql, [agent.agentId, agent.password]).then(results => {
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

module.exports = new Login();