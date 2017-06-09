const pool = require('../config/mysql');

class Company {
    getCompany(companyId) {
        return new Promise((resolve, reject) => {
            pool.getConnection().then((conn) => {
                var sql = 'SELECT * FROM company WHERE company_id = ?';
                conn.query(sql, [companyId]).then(results => {
                    pool.releaseConnection(conn);
                    if(results.length == 0) {
                        reject("NO_DATA");
                        return;
                    }
                    resolve(results[0]);
                }).catch(err => {
                    reject('QUERY_ERR');
                });
            }).catch(err => {
                reject('CONNECTION_ERR');
            });
        });
    }

    getCompanies(type) {
        return new Promise((resolve, reject) => {
            pool.getConnection().then((conn) => {
                let where = "";
                if (type) {
                    where += 'WHERE type LIKE "%' + type + '%"';
                }
                let countSql = 'SELECT count(*) as count FROM company ' + where;
                conn.query(countSql).then(results => {
                    const count = parseInt(results[0].count);
                    const sql = 'SELECT * FROM company ' + where;
                    conn.query(sql).then(results => {
                        pool.releaseConnection(conn);
                        if(results.length == 0) {
                            reject("NO_DATA");
                            return;
                        }
                        resolve({
                            count: count,
                            data: results
                        });
                    }).catch(err => {
                        reject('QUERY_ERR');
                    });
                }).catch(err => {
                    reject('QUERY_ERR');
                });
            }).catch(err => {
                reject('CONNECTION_ERR');
            });
        });
    }
}

module.exports = new Company();

