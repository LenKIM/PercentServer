const pool = require('../config/mysql');

class Notices {

    getNotice(noticeId, callback) {
        pool.getConnection(function (err, conn) {

            if (err) {
                return callback(err);
            }

            console.log(noticeId);

            var sql = 'SELECT * FROM notice WHERE notice_id = ?';
            conn.query(sql, [noticeId], function (err, results) {
                if (err) {
                    return callback(err);
                }

                conn.release();
                return callback(null, {msg: "success", data: results});
            });
        });
    }

    getNotices(page, count, keyword, callback) {
        pool.getConnection(function (err, conn) {
            if (err) {
                return callback(err);
            }

            var where = "";
            if (keyword) {
                where += 'WHERE title LIKE "%' + keyword + '%"';
            }

            var countSql = 'SELECT count(*) as count FROM notice ' + where;
            conn.query(countSql, function (err, results) {
                if (err) {
                    return callback(err);
                }

                var totalCount = parseInt(results[0].count);
                var maxPage = Math.floor(totalCount / count);
                var offset = count * (page - 1);

                var sql = 'SELECT * FROM notice ' + where + ' LIMIT ? OFFSET ?';
                conn.query(sql, [count, offset], function (err, results) {
                    if(err) {
                        return callback(err);
                    }

                    var paging = {
                        total: totalCount,
                        maxPage : maxPage,
                        page : page,
                        count : count
                    };

                    conn.release();
                    return callback(null, {
                        paging : paging,
                        data : results
                    });
                });
            });
        });
    }

    addNotice(title, content, type, callback) {
        pool.getConnection(function (err, conn) {

            if (err) {
                return callback(err);
            }

            var sql = 'INSERT INTO notice (title, content, type) VALUES (?, ?, ?)';
            conn.query(sql, [title, content, type], function (err, results) {
                if (err) {
                    return callback(err);
                }

                conn.release();
                return callback(null, {msg: "success"});
            });
        });
    }

    updateNotice(noticeId, title, content, type, callback) {
        pool.getConnection(function (err, conn) {

            if (err) {
                return callback(err);
            }

            var sql = 'UPDATE notice SET title = ?, content = ?, type = ? WHERE notice_id = ?';
            conn.query(sql, [title, content, type, noticeId], function (err, results) {
                if (err) {
                    return callback(err);
                }

                conn.release();
                return callback(null, {msg: "success"});
            });
        });
    }

    deleteNotice(noticeId, callback) {
        pool.getConnection(function (err, conn) {

            if (err) {
                return callback(err);
            }

            var sql = 'DELETE FROM notice WHERE notice_id = ?';
            conn.query(sql, [noticeId], function (err, results) {
                if (err) {
                    return callback(err);
                }

                conn.release();
                return callback(null, {msg: "success"});
            });
        });
    }
}

module.exports = new Notices();

