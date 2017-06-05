const express = require('express');
const router = express.Router();
const Pager = require('../../model/pager');
const Review = require('../../model/review');
const Request = require('../../model/request');
const Agent = require('../../model/agent');
const reviewService = require('../../service/review');
const FCM = require('../../config/fcm');
const agentService = require('../../service/agent');


router.route('/reviews')
    .put(addReview)
    .get(showReviewList);

//클라이언트가 리뷰화면에서 보여지는 부분
router.route('/reviews/agent/:requestId')
    .get(showReviewByRequestId);

router.route('/reviews/request/:requestId')
    .get(showReviewByRequestId);

//메인화면에서 리뷰 상세 불러오기
router.route('/reviews/:reviewId')
    .get(showReviewByReviewId);


router.route('/reviews/collected/:reviewId')
    .get(showCollectedReview);

router.route('/reviews/calculator/:reviewId')
    .get(calculatorByReviewId);

function showCollectedReview(req, res, next) {
    var reviewId = parseInt(req.params.reviewId);
    if(typeof reviewId !== 'number' || isNaN(reviewId)){
        res.send({msg : 'wrong parameters'});
        return;
    }

    const review = new Review(
        reviewId,
        null,
        null,
        null,
        null
    );
    reviewService.getCollectedReviews(review).then(results => {
        res.send({msg : 'success', data: results})
    }).catch(err => {
        res.send({msg : 'error', error : err})
    });
}

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
        res.send({msg : 'error', error : err})
    });
}

function showReviewByReviewId(req, res, next) {

    let reviewId = parseInt(req.params.reviewId);

    if(typeof reviewId !== 'number' || isNaN(reviewId)){
        res.send({msg: 'wrong parameters'});
        return;
    }

    const review = new Review(
        reviewId,
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
async function addReview(req, res, next) {
    const body = req.body;
    let requestId = parseInt(body.requestId);
    let content = body.content;
    let score = parseInt(body.score);

    if(typeof requestId !== 'number' || isNaN(requestId)){
        res.send({msg: 'wrong parameters'});
        return;
    }

    if(typeof score !== 'number' || isNaN(score)){
        res.send({msg: 'wrong parameters'});
        return;
    }
    const review = new Review(
        null,
        requestId,
        content,
        score,
        null
    );

try {
    const getToken = await agentService.getAgentTokenByRequestId(review.requestId);
    console.log(getToken);
    const results = await reviewService.addReview(review);
    res.send({
        msg : 'success',
        data : results
        });
    const reviewReceived =  await FCM.sendNotification(getToken, "리뷰 도착", "채택된 견적서에 리뷰가 도착했습니다.");

    res.send({msg : '리뷰 작성 완료 및 푸시 리뷰 전송 완료'});
    console.log(reviewReceived);
}catch (err){
    console.log(err);
}

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
        res.send({error: err});
    });
}

/**
 * 리뷰 ID로 리뷰 1개 불러오기
 * @param req
 * @param res
 * @param next
 */
function showReviewByRequestId(req, res, next) {
    var requestId = parseInt(req.params.requestId);

    if(typeof requestId != 'number' || isNaN(requestId)){
        res.send({msg: 'wrong parameters'});
        return;
    }

    const request = new Request(
        requestId
    );

    reviewService.getReviewByRequestId(request).then(results => {
        res.send({msg: 'success', data: results});
    }).catch(err => {
        res.send({msg: err});
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
        res.send({msg: err})
    });
}

module.exports = router;