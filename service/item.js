const pool = require('../config/mysql');

class Item {
    getItem(itemId) {
        return new Promise((resolve, reject) => {
            pool.getConnection().then((conn) => {
                const sql = 'SELECT * FROM item AS it, agent AS ag WHERE it.agent_id = ag.agent_id AND it.item_id = ?';
                conn.query(sql, [itemId]).then(results => {
                    pool.releaseConnection(conn);
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

    getItems(agentId, loanType, page, count) {
        return new Promise((resolve, reject) => {
            pool.getConnection().then((conn) => {
                const countSql = 'SELECT count(*) as count FROM item WHERE item.agent_id = ? AND item.loan_type = ?';
                conn.query(countSql, [agentId, loanType]).then(results => {
                    const totalCount = parseInt(results[0].count);
                    const maxPage = Math.floor(totalCount / count);
                    const offset = count * (page - 1);
                    const sql = 'SELECT * FROM item WHERE item.agent_id = ? AND item.loan_type = ? LIMIT ? OFFSET ?';
                    conn.query(sql, [agentId, loanType, count, offset]).then(results => {
                        pool.releaseConnection(conn);
                        let paging = {
                            total: totalCount,
                            maxPage: maxPage,
                            page: page,
                            count: count
                        };
                        resolve({
                            paging: paging,
                            data: results
                        });
                    }).catch(err => {
                        pool.releaseConnection(conn);
                        reject('QUERY_ERR')
                    });
                }).catch(err => {
                    pool.releaseConnection(conn);
                    reject('QUERY_ERR')
                });
            }).catch(err => {
                reject('CONNECTION_ERR')
            });
        });
    }

    /**
     * 사용자 입력을 통한 데이터 삽입
     * @param item
     * @param agent
     * @returns {Promise}
     */
    addItem(item, agent) {
        return new Promise((resolve, reject) => {
            pool.getConnection().then(conn => {
                const sql = 'INSERT INTO item (agent_id, item_bank, item_name, min_interest_rate, max_interest_rate, interest_rate_type, repayment_type, overdue_interest_rate_1, overdue_interest_rate_2, overdue_interest_rate_3, overdue_time_1, overdue_time_2, overdue_time_3, early_repayment_fee, loan_type) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
                conn.query(sql, [
                    agent.agentId,
                    item.itemBank,
                    item.itemName,
                    item.minInterestRate,
                    item.maxInterestRate,
                    item.interestRateType,
                    item.repaymentType,
                    item.overdueInterestRate1,
                    item.overdueInterestRate2,
                    item.overdueInterestRate3,
                    item.overdueTime1,
                    item.overdueTime2,
                    item.overdueTime3,
                    item.earlyRepaymentFee,
                    item.loanType
                ]).then(results => {
                    pool.releaseConnection(conn);
                    resolve(results);
                }).catch(err => {
                    pool.releaseConnection(conn);
                    reject('QUERY_ERR');
                });
            }).catch(err => {
                reject('CONNECTION_ERR');
            });
        });
    }

    updateItem(item) {
        return new Promise((resolve, reject) => {
            pool.getConnection().then(conn => {
                const sql = 'UPDATE item SET item_bank = ?, item_name = ?, min_interest_rate = ?, max_interest_rate = ?, interest_rate_type = ?, repayment_type = ?, overdue_interest_rate_1 = ?, overdue_interest_rate_2 = ?, overdue_interest_rate_3 = ?, overdue_time_1 = ?, overdue_time_2 = ?, overdue_time_3 = ?, early_repayment_fee = ?, loan_type = ? WHERE item_id = ?';
                conn.query(sql, [
                    item.itemBank,
                    item.itemName,
                    item.minInterestRate,
                    item.maxInterestRate,
                    item.interestRateType,
                    item.repaymentType,
                    item.overdueInterestRate1,
                    item.overdueInterestRate2,
                    item.overdueInterestRate3,
                    item.overdueTime1,
                    item.overdueTime2,
                    item.overdueTime3,
                    item.earlyRepaymentFee,
                    item.loanType,
                    item.itemId
                ]).then(results => {
                    pool.releaseConnection(conn);
                    resolve(results);
                }).catch(err => {
                    pool.releaseConnection(conn);
                    reject('QUERY_ERR');
                });
            }).catch(err => {
                reject('CONNECTION_ERR');
            });
        });
    }

    deleteItem(itemId) {
        return new Promise((resolve, reject) => {
            pool.getConnection().then(conn => {
                const sql = 'DELETE FROM item WHERE item_id = ?';
                conn.query(sql, [itemId]).then(results => {
                    pool.releaseConnection(conn);
                    resolve(results);
                }).catch(err => {
                    pool.releaseConnection(conn);
                    reject('QUERY_ERR');
                });
            }).catch(err => {
                reject('CONNECTION_ERR');
            });
        });
    }
}

module.exports = new Item();