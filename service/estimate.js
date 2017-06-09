const pool = require('../config/mysql');

class Estimate {
    /**
     * 요청서 상세 화면에서
     * 모집된 견적서 목록보기
     * @param request
     * @returns {Promise}
     */
    /* TODO : 여기서 ERROR를 THROW 해서 APP.JS의 ERROR HANDLER에서 처리하는게 더 효율적일듯... 다 바꿔야 함(나중에 ㅎ).
     async getEstimatesByRequestId(requestId) {
     try {
     let conn = await pool.getConnection();
     const sql = 'SELECT * FROM estimate, agent WHERE estimate.agent_id = agent.agent_id AND estimate.request_id = ?';
     let results = await conn.query(sql, [requestId]);
     if (results.length == 0) {
     results = 'NO_DATA';
     }
     ;
     return results;
     } catch (error) {
     throw error;
     }
     }

     // 참고 예제
     async function doIt() {
     try {
     let r1 = await
     randomTask();
     let r2 = await
     randomTask();
     let sum = await
     addTask(r1, r2);
     console.log('Random Numbers : ', r1, r2);
     console.log('DoIt finish, sum =', sum);
     return sum;
     } catch (error) {
     console.log('Task Failure', error);
     throw error;
     }
     }

     async function runTask() {
     try {
     let ret = await
     doIt();
     console.log('Run Task Ret : ', ret);
     }
     catch (error) {
     console.log('Run Task Error :', error);
     }
     }*/
    getEstimatesByRequestId(requestId) {
        return new Promise((resolve, reject) => {
            pool.getConnection().then((conn) => {
                const sql = 'SELECT * FROM estimate, agent WHERE estimate.agent_id = agent.agent_id AND estimate.request_id = ?';
                conn.query(sql, [requestId]).then(results => {
                    pool.releaseConnection(conn);
                    if (results.length == 0) {
                        reject("NO_DATA");
                        return;
                    }
                    resolve(results);
                }).catch(error => {
                    reject('QUERY_ERR');
                });
            }).catch(error => {
                reject('CONNECTION_ERR');
            });
        });
    }

    /**
     * 상담사 자신이 견적한
     * 견적서 목록보기
     * @returns {Promise}
     * @param agentId
     */
    getEstimatesByAgentId(agentId) {
        return new Promise((resolve, reject) => {
            pool.getConnection().then((conn) => {
                const sql = 'SELECT * FROM estimate WHERE estimate.agent_id = ?';
                conn.query(sql, [agentId]).then(results => {
                    pool.releaseConnection(conn);
                    if (results.length === 0) {
                        reject("NO_DATA");
                        return;
                    }
                    resolve(results);
                }).catch(err => {
                    reject("QUERY_ERR");
                });
            }).catch((err) => {
                reject("CONNECTION_ERR");
            });
        });
    }

    /**
     * 요청서 상세 화면에서
     * 모집된 견적서 목록 중
     * 특정 견적서 상세보기
     *
     * [FUNC_REPAYMENT_AMOUNT_PER_MONTH]
     * 원리금 균등 상환
     * 매월 상환액 계산하기
     * A = 대출원금
     * b = 대출이자율, 즉 연이자율/12
     * n = 상환기간, 즉 실제상환개월수
     * 참고 : DB에서 쿼리로 정의 해줘야 사용할 수 있습니다.
     * SET GLOBAL log_bin_trust_function_creators = 1;
     * AWS에서는 Parameter Groups에서 값을 변경해야 한다.
     *
     * DELIMITER $$
     * DROP FUNCTION IF EXISTS hellomoney.FUNC_REPAYMENT_AMOUNT_PER_MONTH$$
     * CREATE FUNCTION hellomoney.FUNC_REPAYMENT_AMOUNT_PER_MONTH(loan_amount INT, interest_rate FLOAT, loan_period INT) RETURNS FLOAT
     * BEGIN
     * DECLARE results FLOAT DEFAULT -1;
     * SET @A = loan_amount;
     * SET @b = (( interest_rate / 100) / 12);
     * SET @n = loan_period*12;
     * SET @ret = @A*@b*POW(1+@b,@n) / (POW(1+@b,@n)-1);
     * SELECT @ret INTO results;
     * RETURN results;
     * END $$
     * DELIMITER ;
     *
     * @param estimateId
     */
    getEstimateByEstimateId(estimateId) {
        return new Promise((resolve, reject) => {
            pool.getConnection().then((conn) => {
                const sql = 'SELECT FUNC_REPAYMENT_AMOUNT_PER_MONTH(request.loan_amount, estimate.interest_rate, request.loan_period) as repayment_amount_per_month, estimate.*, agent.*, request.* FROM estimate, agent, request WHERE 1=1 AND estimate.agent_id = agent.agent_id AND estimate.request_id = request.request_id AND estimate.estimate_id = ?';
                conn.query(sql, [estimateId]).then(results => {
                    pool.releaseConnection(conn);
                    if (results.length === 0) {
                        reject("NO_DATA");
                        return;
                    }
                    resolve(results[0]);
                }).catch(error => {
                    reject('QUERY_ERR');
                }).catch((error) => {
                    reject("CONNECTION_ERR");
                });
            });
        });
    }
}

module.exports = new Estimate();