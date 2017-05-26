const pool = require('../config/mysql');

class Estimate {
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
}

module.exports = new Estimate();