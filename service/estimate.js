const pool = require('../config/mysql');

class Estimate {
    /**
     * 요청서 상세 화면에서
     * 모집된 견적수와 평균 금리 불러오기
     * @param request
     * @returns {Promise}
     */
    getEstimatesCountAndAvgInterest(request) {
        return new Promise((resolve, reject) => {
            pool.getConnection().then((conn) => {
                const sql = 'SELECT COUNT(*) AS estimate_count, AVG(interest_rate) AS avg_interest_rate FROM estimate WHERE request_id = ?';
                conn.query(sql, [request.requestId]).then(results => {
                    pool.releaseConnection(conn);

                    if (results[0].estimate_count == 0) {
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
     * 요청서 상세 화면에서
     * 모집된 견적서 목록보기
     * @param request
     * @returns {Promise}
     */
    getEstimatesByRequestId(request) {
        return new Promise((resolve, reject) => {
            pool.getConnection().then((conn) => {
                const sql = 'SELECT * FROM estimate, agent WHERE estimate.agent_id = agent.agent_id AND estimate.request_id = ?';
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
     * 요청서 상세 화면에서
     * 모집된 견적서 목록 중
     * 특정 견적서 상세보기
     * @param estimate
     */
    getEstimateByEstimateId(estimate) {
        return new Promise((resolve, reject) => {
            pool.getConnection().then((conn) => {
                const sql = 'SELECT * FROM estimate, agent, request WHERE estimate.agent_id = agent.agent_id AND estimate.request_id = request.request_id AND estimate.estimate_id = ?';
                conn.query(sql, [estimate.estimateId]).then(results => {
                    pool.releaseConnection(conn);

                    if(results.length == 0) {
                        reject("no data");
                        return;
                    }

                    this.getRepaymentPerMonth(results[0]).then(ret => {
                        console.log(ret);
                        results[0]["repayment_amount_per_month"] = ret;
                        resolve(results);
                    });
                }).catch((err) => {
                    reject(err);
                });
            }).catch((err) => {
                reject(err);
            });
        });
    }

    /*
    writeEstimate(estimate) {
        return new Promise((resolve, reject) => {
            pool.getConnection().then(conn => {
                var sql = 'INSERT INTO estimate (estimate_id, request_id, agent_id, item_bank, item_name, interest_rate, interest_rate_type, repayment_type, overdue_interest_rate_1, overdue_interest_rate_2, overdue_interest_rate_3, overdue_time_1, overdue_time_2, overdue_time_3, early_repayment_fee) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
                conn.query(sql, [
                    estimate.estimateId,
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
                ]).then(results => {
                    pool.releaseConnection(conn);
                    resolve(results);
                }).catch(err => {
                    reject(err);
                });
            });
        });
    }

    editEstimate(estimate) {
        return new Promise((resolve, reject) => {
            pool.getConnection().then(conn => {
                var sql = 'UPDATE estimate SET item_bank = ?, item_name = ?, interest_rate = ?, interest_rate_type = ?, repayment_type = ?, overdue_interest_rate_1 = ?, overdue_interest_rate_2 = ?, overdue_interest_rate_3 = ?, overdue_time_1 = ?, overdue_time_2 = ?, overdue_time_3 = ?, early_repayment_fee = ? WHERE estimate_id = ?';
                conn.query(sql, [
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
                    estimate.earlyRepaymentFee,
                    estimate.estimateId
                ]).then(results => {
                    pool.releaseConnection(conn);
                    resolve(results);
                }).catch(err => {
                    reject(err);
                });
            });
        });
    }
     */

    /**
     * 원리금 균등 상환
     * 매월 상환액 계산하기
     * A = 대출원금
     * b = 대출이자율, 즉 연이자율/12
     * n = 상환기간, 즉 실제상환개월수
     * @param estimate
     * @returns {Promise}
     */
    getRepaymentPerMonth(estimate) {
        return new Promise((resolve, reject) => {
            const A = parseInt(estimate.loan_amount);
            const b = (parseFloat(estimate.interest_rate) / 100) / 12;
            const n = parseInt(estimate.loan_period) * 12;
            const ret = A * b * Math.pow(1 + b, n) / (Math.pow(1 + b, n) - 1);
            resolve(ret);
        });
    }
}

module.exports = new Estimate();