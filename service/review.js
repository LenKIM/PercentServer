/**
 * Created by len on 2017. 5. 23..
 */
const pool = require('../config/mysql');

class Review {

    //review라는 모델을 넘겨줌.
    addReview(review){
        return new Promise((resolve, reject) => {
            pool.getConnection().then((conn) => {
                let sql = 'INSERT INTO review (request_id, content, score) VALUES (?,?,?)';
                conn.query(sql, [review.requestsId,review.content, review.score]).then(results => {

                    pool.releaseConnection(conn);
                    resolve(results);

                }).catch(err => {
                    reject(err);
                });
            });
        });
    }

    getReviewByAgent(agent, pager){
        return new Promise((resolve, reject) => {

            pool.getConnection().then((conn) => {

            var where = '';
            console.log(agent.agentId+ " ///");
            if(agent.agentId) {
                where += 'and agent.agent_id =' + agent.agentId;
            }

            var countSql = 'SELECT count(*) AS count FROM review, request, estimate, agent WHERE ' +
                'review.request_id = request.request_id ' +
                'and request.selected_estimate_id = estimate.estimate_id ' +
                'and estimate.agent_id = agent.agent_id ' + where;


                conn.query(countSql).then(results => {

                    console.log(results);

                var totalCount = parseInt(results[0].count);
                var maxPage = Math.floor(totalCount / pager.count);
                var offset = pager.count * (pager.page - 1 );

                var sql = 'SELECT ' +
                    'review.content, review.score, review.register_time ' +
                    'FROM review, request, estimate, agent ' +
                    'WHERE ' +
                    'review.request_id = request.request_id ' +
                    'and request.selected_estimate_id = estimate.estimate_id ' +
                    'and estimate.agent_id = agent.agent_id ' + 'and agent.agent_id =? LIMIT ? OFFSET ?';

                console.log(sql);

                conn.query(sql, [agent.agentId, pager.count, offset]).then(results => {
                    pool.releaseConnection(conn);
                    var paging = {
                        total: totalCount,
                        maxPage: maxPage,
                        page: pager.page,
                        count: pager.count
                    };

                    //content와 score 반환
                    resolve({
                        paging: paging,
                        data: results
                    });
                });
            });
        }).catch((err) => {
                reject(err);
            });
        });
    }

    getReviewByReviewId(review) {
        return new Promise((resolve, reject) => {
            pool.getConnection().then((conn) => {
                let where = '';
                // if(pager.keyword){
                    where += 'WHERE review_id =?';
                // }

                // let countSql = 'SELECT count(*) as count FROM review ' + where;
                // conn.query(countSql).then( results => {
                //
                //     const totalCount = parseInt(results[0].count);
                //     const maxPage = Math.floor(totalCount / pager.count);
                //     const offset = pager.count * (pager.page -1);

                    // var sql = 'SELECT * FROM review ' + where + ' LIMIT ? OFFSET ?';
                    var sql = 'SELECT * FROM review ' + where;
                    conn.query(sql, [review.reviewId]).then(results => {
                        pool.releaseConnection(conn);
                        // let paging = {
                        //     total : totalCount,
                        //     maxPage: maxPage,
                        //     page: pager.page,
                        //     count: pager.count
                        // };

                        resolve(results
                            // paging: paging,
                            // data: results
                        );
                    });
                });
            }).catch((err) => {
                reject(err);
            });
    }// End of getReviews

    // 수정 이상함... 리뷰슈정시 쓴 사람의 번호가 없음.
    // updateReview(review){
    //     return new Promise((resolve, reject) => {
    //         pool.getConnection().then(conn => {
    //             var sql = 'UPDATE review SET '
    //         })
    //     })
    // }
}

module.exports = new Review();