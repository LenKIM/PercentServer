const pool = require('../config/mysql');

class Company {

    // TODO
    // async getCompany(company) {
    //     try {
    //         const conn = await pool.getConnection();
    //         const sql = 'SELECT * FROM company WHERE company_id = ?';
    //         const results = await conn.query(sql, [company.companyId]);
    //     } catch (e) {
    //
    //     }
    getCompany(company) {
        return new Promise((resolve, reject) => {


            pool.getConnection().then((conn) => {
                var sql = 'SELECT * FROM company WHERE company_id = ?';
                conn.query(sql, [company.companyId]).then(results => {
                    pool.releaseConnection(conn);
                    if (results.length == 0) {
                        reject("no data");
                    }
                    resolve(results);
                }).catch(err => {
                    reject("query error");
                });
            }).catch((err) => {
                reject("connection error");
            });
        });
    }

    getCompanies(type) {
        return new Promise((resolve, reject) => {
            pool.getConnection().then((conn) => {
                var where = "";
                if (type) {
                    where += 'WHERE type LIKE "%' + type + '%"';
                }

                var countSql = 'SELECT count(*) as count FROM company ' + where;
                conn.query(countSql).then(results => {
                    var count = parseInt(results[0].count);
                    var sql = 'SELECT * FROM company ' + where;
                    conn.query(sql).then(results => {
                        pool.releaseConnection(conn);
                        resolve({
                            count: count,
                            data: results
                        });
                    }).catch(err => {
                        reject("query error");
                    });
                }).catch(err => {
                    reject("query error");
                });
            }).catch(err => {
                reject("connection error");
            });
        });
    }
}

module.exports = new Company();

