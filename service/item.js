const pool = require('../config/mysql');

class Item{
    constructor(){

    }

    getItem(agent, item){
        return new Promise((resolve, reject) => {
            pool.getConnection().then((conn) => {
                const sql = 'SELECT * FROM item AS it, agent AS ag WHERE it.agent_id = ag.agent_id and ag.agent_id =? and it.item_id =?';
                conn.query(sql,[agent.agentId]).then(results => {
                    pool.releaseConnection(conn);
                    resolve(results);
                });
            }).catch((err) => {
                reject(err);
            });
        });
    }

    getItems(agent,pager){
        return new Promise((resolve, reject) => {
            pool.getConnection().then((conn) => {

                const countSql = 'SELECT count(*) as count FROM item,agent WHERE item.agent_id = agent.agent_id and agent.agent_id =' + agent.agentId;
                conn.query(countSql).then(results => {

                    const totalCount = parseInt(results[0].count);
                    const maxPage = Math.floor(totalCount / pager.count);
                    const offset = pager.count * (pager.page -1);

                    const sql = 'SELECT * FROM item LIMIT ? OFFSET ?';
                    conn.query(sql, [pager.count, offset]).then(results => {
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
     * @returns {Promise}
     */
    addItem(item){
        return new Promise((resolve, reject) => {
            pool.getConnection().then(conn => {
                //TODO #1 UI완성에 따른 요청,응답 작성하기.
                const sql = 'INSERT INTO item ( ) VALUES (?,?,?,?)'
                conn.query(sql, []).then(results => {
                    pool.releaseConnection(conn);
                    resolve(results);
                }).catch(err => {
                    reject(err);
                });
            });
        });
    }

    updateItem(item){
        return new Promise((resolve, reject) => {
            pool.getConnection().then(conn => {
                //ADD 할때와 동일하게 입력 값을 넣어줄 것
            })
        });
    }

    deleteitem(item){
        return new Promise((resolve, reject) => {
            pool.getConnection().then(conn => {
                const sql = 'DELETE FROM item WHERE item_id = ?';
                conn.query(sql, [item.itemId]).then(results => {
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