const pool = require('../config/mysql');

class Notice {
    constructor(noticeId, title, content, type) {
        this.noticeId = noticeId;
        this.title = title;
        this.content = content;
        this.type = type;
    }

    getNotice() {
        return new Promise((resolve, reject) => {
            pool.getConnection().then((conn) => {
                var sql = 'SELECT * FROM notice WHERE notice_id = ?';
                conn.query(sql, [this.noticeId]).then(results => {
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
                var where = "";
                if (pager.keyword) {
                    where += 'WHERE title LIKE "%' + pager.keyword + '%"';
                }

                var countSql = 'SELECT count(*) as count FROM notice ' + where;
                conn.query(countSql).then(results => {

                    var totalCount = parseInt(results[0].count);
                    var maxPage = Math.floor(totalCount / pager.count);
                    var offset = pager.count * (pager.page - 1);

                    var sql = 'SELECT * FROM notice ' + where + ' LIMIT ? OFFSET ?';
                    conn.query(sql, [pager.count, offset]).then(results => {
                        pool.releaseConnection(conn);
                        var paging = {
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

    addNotice() {
        return new Promise((resolve, reject) => {
            pool.getConnection().then(conn => {
                var sql = 'INSERT INTO notice (title, content, type) VALUES (?, ?, ?)';
                conn.query(sql, [this.title, this.content, this.type]).then(results => {
                    pool.releaseConnection(conn);
                    resolve(results);
                }).catch(err => {
                    reject(err);
                });
            });
        });
    }

    updateNotice() {
        return new Promise((resolve, reject) => {
            pool.getConnection().then(conn => {
                var sql = 'UPDATE notice SET title = ?, content = ?, type = ? WHERE notice_id = ?';
                conn.query(sql, [this.title, this.content, this.type, this.noticeId]).then(results => {
                    pool.releaseConnection(conn);
                    resolve(results);
                }).catch(err => {
                    reject(err);
                });
            });
        });
    }

    deleteNotice() {
        return new Promise((resolve, reject) => {
            pool.getConnection().then(conn => {
                var sql = 'DELETE FROM notice WHERE notice_id = ?';
                conn.query(sql, [this.noticeId]).then(results => {
                    pool.releaseConnection(conn);
                    resolve(results);
                }).catch(err => {
                    reject(err);
                });
            });
        });
    }
}

module.exports = Notice;

