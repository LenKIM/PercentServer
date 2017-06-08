const pool = require('../config/mysql');

class Item{
    constructor(){
    }

    getItem(itemId){
        return new Promise((resolve, reject) => {
            pool.getConnection().then((conn) => {
                const sql = 'SELECT * FROM item AS it, agent AS ag WHERE it.agent_id = ag.agent_id AND it.item_id =?';
                conn.query(sql,[itemId]).then(results => {
                    pool.releaseConnection(conn);
                    resolve(results);
                });
            }).catch((err) => {
                reject(err);
            });
        });
    }

    getItems(agent, pager){
        return new Promise((resolve, reject) => {
            pool.getConnection().then((conn) => {

                const countSql = 'SELECT count(*) as count FROM item, agent WHERE item.agent_id = agent.agent_id AND agent.agent_id = ?';
                conn.query(countSql, [agent.agentId]).then(results => {

                    const totalCount = parseInt(results[0].count);
                    const maxPage = Math.floor(totalCount / pager.count);
                    const offset = pager.count * (pager.page -1);

                    const sql = 'SELECT * FROM item, agent WHERE item.agent_id = agent.agent_id AND agent.agent_id = ? LIMIT ? OFFSET ?';
                    conn.query(sql, [agent.agentId , pager.count, offset ]).then(results => {
                        pool.releaseConnection(conn);

                        let paging = {
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
            }).catch(err => {
                reject(err);
            })
        });
    }

    /**
     * 사용자 입력을 통한 데이터 삽입
     * @param item
     * @param agent
     * @returns {Promise}
     */
    addItem(item, agent){
        return new Promise((resolve, reject) => {
            pool.getConnection().then(conn => {
                pool.releaseConnection(conn);
                const sql = 'INSERT INTO item (agent_id, item_bank, item_name, ' +
                    'min_interest_rate, max_interest_rate, interest_rate_type, ' +
                    'repayment_type, overdue_interest_rate_1, overdue_interest_rate_2, ' +
                    'overdue_interest_rate_3, overdue_time_1, overdue_time_2, ' +
                    'overdue_time_3, early_repayment_fee) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)';

                conn.query(sql, [agent.agentId, item.itemBank, item.itemName,
                    item.minInterestrate, item.maxInterestrate, item.interestRateType,
                    item.repaymentType, item.overdueInterestRate01, item.overdueInterestRate02,
                    item.overdueInterestRate03, item.overdueTime01, item.overdueTime02, item.overdueTime03,
                    item.earlyRepaymentFee ]).then(results => {
                    resolve(results);
                }).catch(err => {
                    reject(err);
                });
            });
        });
    }

    updateItem(item, agent){
        return new Promise((resolve, reject) => {
            pool.getConnection().then(conn => {
                pool.releaseConnection(conn);

                const sql = 'UPDATE item SET item_bank = ?, item_name = ?, ' +
                    'min_interest_rate = ?, max_interest_rate = ?, interest_rate_type = ?, ' +
                    'repayment_type = ?, overdue_interest_rate_1 = ?, overdue_interest_rate_2 = ?, ' +
                    'overdue_interest_rate_3 = ?, overdue_time_1 = ?, overdue_time_2 = ?, ' +
                    'overdue_time_3 = ?, early_repayment_fee = ? WHERE item_id = ?';

                conn.query(sql, [ item.itemBank, item.itemName,
                    item.minInterestrate, item.maxInterestrate, item.interestRateType,
                    item.repaymentType, item.overdueInterestRate01, item.overdueInterestRate02,
                    item.overdueInterestRate03, item.overdueTime01, item.overdueTime02, item.overdueTime03,
                    item.earlyRepaymentFee , item.itemId ]).then(results => {

                    resolve(results);

                }).catch(err => {
                    reject(err);
                });
            });
        });
    }

    deleteItem(itemId){
        return new Promise((resolve, reject) => {
            pool.getConnection().then(conn => {
                const sql = 'DELETE FROM item WHERE item_id =?';
                conn.query(sql, [itemId]).then(results => {
                    pool.releaseConnection(conn);
                    resolve(results);
                }).catch(err => {
                    reject(err);
                });
            });
        });
    }
}

module.exports = new Item();