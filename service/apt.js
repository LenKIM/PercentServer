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
                    if(results.length == 0) {
                        reject("NO_DATA");
                        return;
                    }
                    resolve(results);
                }).catch(error => {
                    reject('QUERY_ERR');
                });
            }).catch(error => {
                reject('CONNECTION_ERR');
            });
        });
    }

    /**
     * 시/군/구 목록 불러오기
     * @returns {Promise}
     * @param region1
     */
    getRegions2(region1) {
        return new Promise((resolve, reject) => {
            pool.getConnection().then((conn) => {
                const sql = 'SELECT distinct(region_2) FROM apt WHERE region_1 = ?';
                conn.query(sql, [region1]).then(results => {
                    pool.releaseConnection(conn);
                    if(results.length == 0) {
                        reject("NO_DATA");
                        return;
                    }
                    resolve(results);
                }).catch(error => {
                    reject('QUERY_ERR');
                });
            }).catch(error => {
                reject('CONNECTION_ERR');
            });
        });
    }

    /**
     * 읍/면/동 목록 불러오기
     * @returns {Promise}
     * @param region1
     * @param region2
     */
    getRegions3(region1, region2) {
        return new Promise((resolve, reject) => {
            pool.getConnection().then((conn) => {
                const sql = 'SELECT distinct(region_3) FROM apt WHERE region_1 = ? AND region_2 = ?';
                conn.query(sql, [region1, region2]).then(results => {
                    pool.releaseConnection(conn);
                    if(results.length == 0) {
                        reject("NO_DATA");
                        return;
                    }
                    resolve(results);
                }).catch(error => {
                    reject('QUERY_ERR');
                });
            }).catch(error => {
                reject('CONNECTION_ERR');
            });
        });
    }

    /**
     * 아파트 이름 목록 불러오기
     * @returns {Promise}
     * @param region1
     * @param region2
     * @param region3
     */
    getAptNames(region1, region2, region3) {
        return new Promise((resolve, reject) => {
            pool.getConnection().then((conn) => {
                const sql = 'SELECT distinct(apt_name) FROM apt WHERE region_1 = ? AND region_2 = ? AND region_3 = ?';
                conn.query(sql, [region1, region2, region3]).then(results => {
                    pool.releaseConnection(conn);
                    if(results.length == 0) {
                        reject("NO_DATA");
                        return;
                    }
                    resolve(results);
                }).catch(error => {
                    reject('QUERY_ERR');
                });
            }).catch(error => {
                reject('CONNECTION_ERR');
            });
        });
    }

    /**
     * 특정 아파트 정보 목록 불러오기
     * @returns {Promise}
     * @param region1
     * @param region2
     * @param region3
     * @param aptName
     */
    getAptInfo(region1, region2, region3, aptName) {
        return new Promise((resolve, reject) => {
            pool.getConnection().then((conn) => {
                const sql = 'SELECT * FROM apt WHERE region_1 = ? AND region_2 = ? AND region_3 = ? AND apt_name = ?';
                conn.query(sql, [region1, region2, region3, aptName]).then(results => {
                    pool.releaseConnection(conn);
                    if(results.length == 0) {
                        reject("NO_DATA");
                        return;
                    }
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

module.exports = new Apt();