const pool = require('../config/mysql');

class Company {
    getCompany(company) {
        return new Promise((resolve, reject) => {
            pool.getConnection().then((conn) => {
                var sql = 'SELECT * FROM company WHERE company_id = ?';
                conn.query(sql, [company.companyId]).then(results => {
                    pool.releaseConnection(conn);
                    resolve(results);
                });
            }).catch((err) => {
                reject(err);
            });
        });
    }

    getCompanies(company) {
        return new Promise((resolve, reject) => {
            pool.getConnection().then((conn) => {
                let where = "";
                if (company.type) {
                    where += 'WHERE type LIKE "%' + company.type + '%"';
                }
                let countSql = 'SELECT count(*) as count FROM company ' + where;
                conn.query(countSql).then(results => {
                    const count = parseInt(results[0].count);
                    const sql = 'SELECT * FROM company ' + where;
                    conn.query(sql).then(results => {
                        pool.releaseConnection(conn);
                        resolve({
                            count: count,
                            data: results
                        });
                    }).catch(err => reject('QUERY_ERR'));
                });
            }).catch(err => {
                reject('CONNECTION_ERR');
            });
        });
    }
}

module.exports = new Company();

