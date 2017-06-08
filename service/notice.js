const pool = require('../config/mysql');

class Notice {
    getNotice(notice) {
        return new Promise((resolve, reject) => {
            pool.getConnection().then((conn) => {
                const sql = 'SELECT * FROM notice WHERE notice_id = ?';
                conn.query(sql, [notice.noticeId]).then(results => {
                    pool.releaseConnection(conn);
                    resolve(results);
                });
            }).catch((err) => {
                reject(err);
            });
        });
    }

    getNotices(pager) {
        return new Promise((resolve, reject) => {
            pool.getConnection().then((conn) => {
                let where = "";
                if (pager.keyword) {
                    where += 'WHERE title LIKE "%' + pager.keyword + '%"';
                }

                const countSql = 'SELECT count(*) as count FROM notice ' + where;
                conn.query(countSql).then(results => {

                    let totalCount = parseInt(results[0].count);
                    let maxPage = Math.floor(totalCount / pager.count);
                    let offset = pager.count * (pager.page - 1);

                    const sql = 'SELECT * FROM notice ' + where + ' LIMIT ? OFFSET ?';
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
            });
        });
    }

    addNotice(notice) {
        return new Promise((resolve, reject) => {
            pool.getConnection().then(conn => {
                const sql = 'INSERT INTO notice (title, content, type) VALUES (?, ?, ?)';
                conn.query(sql, [notice.title, notice.content, notice.type]).then(results => {
                    pool.releaseConnection(conn);
                    resolve(results);
                }).catch(err => {
                    reject(err);
                });
            });
        });
    }

    updateNotice(notice) {
        return new Promise((resolve, reject) => {
            pool.getConnection().then(conn => {
                const sql = 'UPDATE notice SET title = ?, content = ?, type = ? WHERE notice_id = ?';
                conn.query(sql, [notice.title, notice.content, notice.type, notice.noticeId]).then(results => {
                    pool.releaseConnection(conn);
                    resolve(results);
                }).catch(err => {
                    reject(err);
                });
            });
        });
    }

    deleteNotice(notice) {
        return new Promise((resolve, reject) => {
            pool.getConnection().then(conn => {
                const sql = 'DELETE FROM notice WHERE notice_id = ?';
                conn.query(sql, [notice.noticeId]).then(results => {
                    pool.releaseConnection(conn);
                    resolve(results);
                }).catch(err => {
                    reject(err);
                });
            });
        });
    }
}

module.exports = new Notice();

