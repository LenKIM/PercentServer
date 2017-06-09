const pool = require('../config/mysql');

class FAQ {
    /**
     * FAQ 목록 불러오기
     * @returns {Promise}
     */
    getFAQs() {
        return new Promise((resolve, reject) => {
            pool.getConnection().then((conn) => {
                var sql = 'SELECT * FROM faq';
                conn.query(sql).then(results => {
                    pool.releaseConnection(conn);
                    if(results.length == 0) {
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
}

module.exports = new FAQ();

