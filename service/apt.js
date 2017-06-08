const pool = require('../config/mysql');

class Apt {
    /**
     * 시/도 목록 불러오기
     * @returns {Promise}
     */
    getRegions1() {
        return new Promise((resolve, reject) => {
            pool.getConnection().then((conn) => {
                const sql = 'SELECT distinct(region_1) FROM apt';
                conn.query(sql, []).then(results => {
                    pool.releaseConnection(conn);
                    if (results.length == 0) {
                        reject("no data");
                    }
                    resolve(results);
                }).catch((err) => {
                    reject("sql err");
                });
            }).catch((err) => {
                reject("connection err");
            });
        });
    }

    /**
     * 시/군/구 목록 불러오기
     * @param apt
     * @returns {Promise}
     */
    getRegions2(apt) {
        return new Promise((resolve, reject) => {
            pool.getConnection().then((conn) => {
                const sql = 'SELECT distinct(region_2) FROM apt WHERE region_1 = ?';
                conn.query(sql, [apt.region1]).then(results => {
                    pool.releaseConnection(conn);
                    if (results.length == 0) {
                        reject("no data");
                    }
                    resolve(results);
                }).catch((err) => {
                    reject("sql err");
                });
            }).catch((err) => {
                reject("connection err");
            });
        });
    }

    /**
     * 읍/면/동 목록 불러오기
     * @param apt
     * @returns {Promise}
     */
    getRegions3(apt) {
        return new Promise((resolve, reject) => {
            pool.getConnection().then((conn) => {
                const sql = 'SELECT distinct(region_3) FROM apt WHERE region_1 = ? AND region_2 = ?';
                conn.query(sql, [apt.region1, apt.region2]).then(results => {
                    pool.releaseConnection(conn);
                    if (results.length == 0) {
                        reject("no data");
                    }
                    resolve(results);
                }).catch((err) => {
                    reject("sql err");
                });
            }).catch((err) => {
                reject("connection err");
            });
        });
    }

    /**
     * 아파트 이름 목록 불러오기
     * @param apt
     * @returns {Promise}
     */
    getAptNames(apt) {
        return new Promise((resolve, reject) => {
            pool.getConnection().then((conn) => {
                const sql = 'SELECT distinct(apt_name) FROM apt WHERE region_1 = ? AND region_2 = ? AND region_3 = ?';
                conn.query(sql, [apt.region1, apt.region2, apt.region3]).then(results => {
                    pool.releaseConnection(conn);
                    if (results.length == 0) {
                        reject("no data");
                    }
                    resolve(results);
                }).catch((err) => {
                    reject("sql err");
                });
            }).catch((err) => {
                reject("connection err");
            });
        });
    }

    /**
     * 특정 아파트 정보 목록 불러오기
     * @param apt
     * @returns {Promise}
     */
    getAptInfo(apt) {
        return new Promise((resolve, reject) => {
            pool.getConnection().then((conn) => {
                const sql = 'SELECT * FROM apt WHERE region_1 = ? AND region_2 = ? AND region_3 = ? AND apt_name = ?';
                conn.query(sql, [apt.region1, apt.region2, apt.region3, apt.aptName]).then(results => {
                    pool.releaseConnection(conn);
                    if (results.length == 0) {
                        reject("no data");
                    }
                    resolve(results);
                }).catch((err) => {
                    reject("sql err");
                });
            }).catch((err) => {
                reject("connection err");
            });
        });
    }
}

module.exports = new Apt();