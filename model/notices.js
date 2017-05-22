const pool = require('../config/mysql');

class Notices {
    getNotice(noticeId) {
        return new Promise((resolve, reject) => {
            pool.getConnection((err, conn) => {
                if (err) {
                    return reject(err);
                }

                var sql = 'SELECT * FROM notice WHERE notice_id = ?';
                conn.query(sql, [noticeId], (err, results) => {
                    if (err) {
                        return reject(err);
                    }

                    conn.release();
                    return resolve(results);
                });

            });
        });
    }

    getNotices(page, count, keyword) {
        return new Promise((resolve, reject) => {
            pool.getConnection((err, conn) => {
                if (err) {
                    return reject(err);
                }

                var where = "";
                if (keyword) {
                    where += 'WHERE title LIKE "%' + keyword + '%"';
                }

                var countSql = 'SELECT count(*) as count FROM notice ' + where;
                conn.query(countSql, (err, results) => {
                    if (err) {
                        return reject(err);
                    }

                    var totalCount = parseInt(results[0].count);
                    var maxPage = Math.floor(totalCount / count);
                    var offset = count * (page - 1);

                    var sql = 'SELECT * FROM notice ' + where + ' LIMIT ? OFFSET ?';
                    conn.query(sql, [count, offset], (err, results) => {
                        if (err) {
                            return reject(err);
                        }

                        var paging = {
                            total: totalCount,
                            maxPage: maxPage,
                            page: page,
                            count: count
                        };

                        conn.release();
                        return resolve({
                            paging: paging,
                            data: results
                        });
                    });
                });
            });
        });
    }

    addNotice(title, content, type) {
        return new Promise((resolve, reject) => {
            pool.getConnection((err, conn) => {
                if (err) {
                    return reject(err);
                }

                var sql = 'INSERT INTO notice (title, content, type) VALUES (?, ?, ?)';
                conn.query(sql, [title, content, type], (err, results) => {
                    if (err) {
                        return reject(err);
                    }

                    conn.release();
                    return resolve(results);
                });
            });
        });
    }

    updateNotice(noticeId, title, content, type) {
        return new Promise((resolve, reject) => {
            pool.getConnection((err, conn) => {
                if (err) {
                    return reject(err);
                }

                var sql = 'UPDATE notice SET title = ?, content = ?, type = ? WHERE notice_id = ?';
                conn.query(sql, [title, content, type, noticeId], (err, results) => {
                    if (err) {
                        return reject(err);
                    }

                    conn.release();
                    return resolve(results);
                });
            });
        });
    }

    deleteNotice(noticeId) {
        return new Promise((resolve, reject) => {
            pool.getConnection((err, conn) => {
                if (err) {
                    return reject(err);
                }

                var sql = 'DELETE FROM notice WHERE notice_id = ?';
                conn.query(sql, [noticeId], (err, results) => {
                    if (err) {
                        return reject(err);
                    }

                    conn.release();
                    return resolve(results);
                });
            });
        });
    }
}

module.exports = new Notices();

