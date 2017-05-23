const pool = require('../config/mysql');

class Favorite {
    LikeRequest(favorite) {
        return new Promise((resolve, reject) => {
            pool.getConnection().then((conn) => {
                var sql = "INSERT INTO like_request (agent_id, request_id) VALUES (?, ?) ON DUPLICATE KEY UPDATE agent_id = ?, request_id = ?";
                conn.query(sql, [
                    favorite.agentId,
                    favorite.requestId,
                    favorite.agentId,
                    favorite.requestId
                ]).then(results => {
                    pool.releaseConnection(conn);
                    resolve(results);
                });
            }).catch(err => {
                reject(err);
            });
        });
    }

    unLikeRequest(like) {
        return new Promise((resolve, reject) => {
            pool.getConnection().then((conn) => {
                var sql = 'DELETE FROM like_request WHERE agent_id = ? and request_id = ?';
                conn.query(sql, [like.agentId, like.requestId]).then(results => {
                    pool.releaseConnection(conn);
                    resolve(results);
                });
            }).catch(err => {
                reject(err);
            });
        });
    }

}

module.exports = new Favorite();