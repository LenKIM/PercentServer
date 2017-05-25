const express = require('express');
const router = express.Router();
const Pager = require('../model/pager');
const Review = require('../model/review');
const Agent = require('../model/agent');
const reviewService = require('../service/review');

router.route('/reviews')
    .put(addReview)
    .get(showReviewList);

router.route('/reviews/agent/:agentId')
    .get(showReviewDetailByAgent);

//TODO 
router.route('/reviews/request/:requestId')
    .get(showReviewByRequestId);

//메인화면에서
router.route('/reviews/:reviewId')
    .get(showReviewByReviewId);

router.route('/reviews/calculator/:reviewId')
    .get(calculatorByReviewId);

function calculatorByReviewId(req, res, next) {

    const review = new Review(
        req.params.reviewId,
        null,
        null,
        null,
        null
    );

    reviewService.getEstimateCountAndAvrRate(review).then(results => {
        res.send({msg : 'success', data: results.data})
    }).catch(err => {
        res.send({msg : 'failed', error : err})
    });
}


function showReviewByReviewId(req, res, next) {

    const review = new Review(
        req.params.reviewId,
        null,
        null,
        null,
        null
    );

    const pager = new Pager(
        parseInt(req.query.page) || 1,
        parseInt(req.query.count)|| 30,
        null
    );

    // review.getEstimateCountAndAvrRate(review).then()
    reviewService.getReviewsByReviewId(review, pager).then(results => {
        console.log(req.query.page  + "// " + req.query.count);
        res.send({msg: 'success', paging: results.paging, data: results.data});

    }).catch(err => {

        res.send({msg: 'failed', error : err})

    });
}

/**
 * 리뷰 작성하기
 * @param req
 * @param res
 * @param next
 */
function addReview(req, res, next) {
    const body = req.body;
    const review = new Review(
        null,
        body.requestId,
        body.content,
        body.score,
        null
    );

    reviewService.addReview(review).then((results) => {
        res.send({msg: 'success', status: results});
    }).catch(err => {
        res.send({meg: 'failed', error: err});
    });
}

/**
 * 특정 대출 모집인에 대한 리뷰 목록 불러오기
 * @param req
 * @param res
 * @param next
 */
function showReviewDetailByAgent(req, res, next) {
    const agent = new Agent(
        req.params.agentId
    );
    const pager = new Pager(
        parseInt(req.query.page) || 1,
        parseInt(req.query.count) || 30,
        null
    );

    reviewService.getReviewByAgent(agent, pager).then(results => {
        res.send({msg: 'success', paging: results.paging, data: results.data});
    }).catch(err => {
        res.send({msg: 'failed'});
    });
}

/**
 * 리뷰 ID로 리뷰 1개 불러오기
 * @param req
 * @param res
 * @param next
 */
function showReviewByRequestId(req, res, next) {
    const review = new Review(
        req.params.reviewId
    );

    const page = new Pager(
        req.params.page,
        req.params.count,
        null
    );

    reviewService.getReviewsByReviewId(review, page).then(results => {
        res.send({msg: 'success', data: results});
    }).catch(err => {
        res.send({msg: 'failed'});
    });
}

/**
 * 메인화면 리뷰 목록 불러오기
 * @param req
 * @param res
 * @param next
 */
function showReviewList(req, res, next) {
    const page = parseInt(req.query.page) || 1;
    const count = parseInt(req.query.count) || 30;
    const keyword = req.query.keyword;
    const pager = new Pager(page, count, keyword);

    reviewService.getReviews(pager).then(results => {
        res.send({msg: 'success', paging: results.paging, data: results.data});
    }).catch(err => {
        res.send({msg: 'failed'})
    });
}

module.exports = router;