const pool = require('../config/mysql');

class Notice {
    getNotice(noticeId) {
        return new Promise((resolve, reject) => {
            pool.getConnection().then((conn) => {
                var sql = 'SELECT * FROM notice WHERE notice_id = ?';
                conn.query(sql, [noticeId]).then(results => {
                    pool.releaseConnection(conn);
                    resolve(results[0]);
                }).catch(error => {
                    reject('QUERY_ERR');
                });
            }).catch(error => {
                reject('CONNECTION_ERR');
            });
        });
    }

    getNotices(page, count, keyword) {
        return new Promise((resolve, reject) => {
            pool.getConnection().then((conn) => {
                var where = "";
                if (keyword) {
                    where += 'WHERE title LIKE "%' + keyword + '%"';
                }

                var countSql = 'SELECT count(*) as count FROM notice ' + where;
                conn.query(countSql).then(results => {

                    var totalCount = parseInt(results[0].count);
                    var maxPage = Math.floor(totalCount / count);
                    var offset = count * (page - 1);

                    var sql = 'SELECT * FROM notice ' + where + ' LIMIT ? OFFSET ?';
                    conn.query(sql, [count, offset]).then(results => {
                        pool.releaseConnection(conn);
                        if (results.length == 0) {
                            reject("NO_DATA");
                            return;
                        }
                        var paging = {
                            total: totalCount,
                            maxPage: maxPage,
                            page: page,
                            count: count
                        };
                        resolve({
                            paging: paging,
                            data: results
                        });
                    }).catch(error => {
                        reject('QUERY_ERR');
                    });
                }).catch(error => {
                    reject('QUERY_ERR');
                });
            }).catch(error => {
                reject('CONNECTION_ERR');
            });
        });
    }

    addNotice(title, content, type) {
        return new Promise((resolve, reject) => {
            pool.getConnection().then(conn => {
                var sql = 'INSERT INTO notice (title, content, type) VALUES (?, ?, ?)';
                conn.query(sql, [title, content, type]).then(results => {
                    pool.releaseConnection(conn);
                    resolve(results);
                }).catch(error => {
                    reject('QUERY_ERR');
                });
            }).catch(error => {
                reject('CONNECTION_ERR');
            });
        });
    }

    updateNotice(noticeId, title, content, type) {
        return new Promise((resolve, reject) => {
            pool.getConnection().then(conn => {
                var sql = 'UPDATE notice SET title = ?, content = ?, type = ? WHERE notice_id = ?';
                conn.query(sql, [title, content, type, noticeId]).then(results => {
                    pool.releaseConnection(conn);
                    resolve(results);
                }).catch(error => {
                    reject('QUERY_ERR');
                });
            }).catch(error => {
                reject('CONNECTION_ERR');
            });
        });
    }

    deleteNotice(noticeId) {
        return new Promise((resolve, reject) => {
            pool.getConnection().then(conn => {
                var sql = 'DELETE FROM notice WHERE notice_id = ?';
                conn.query(sql, [noticeId]).then(results => {
                    pool.releaseConnection(conn);
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

module.exports = new Notice();

