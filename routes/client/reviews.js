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
    .post(addReview)
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
    .get(getEstimatesInterestByReviewId);

router.route('/reviews/calculator/:reviewId')
    .get(getEstimatesCountAndAverageInterests);

async function getEstimatesInterestByReviewId(req, res, next) {
    var reviewId = parseInt(req.params.reviewId);
    if (typeof reviewId !== 'number' || isNaN(reviewId)) {
        next('WRONG_PARAMETERS');
        return;
    }

    try {
        const results = await reviewService.getEstimatesInterestByReviewId(reviewId);
        res.send({msg: 'SUCCESS', data: results});
    } catch (error) {
        next(error);
    }
}

async function getEstimatesCountAndAverageInterests(req, res, next) {
    var reviewId = parseInt(req.params.reviewId);
    if (typeof reviewId !== 'number' || isNaN(reviewId)) {
        next('WRONG_PARAMETERS');
        return;
    }

    try {
        const results = await reviewService.getEstimatesCountAndAverageInterests(reviewId);
        res.send({msg: 'SUCCESS', data: results});
    } catch (error) {
        next(error);
    }
}

async function showReviewByReviewId(req, res, next) {
    const reviewId = parseInt(req.params.reviewId);
    if (typeof reviewId !== 'number' || isNaN(reviewId)) {
        next('WRONG_PARAMETERS');
        return;
    }

    try {
        const results = await reviewService.getReviewsByReviewId(reviewId);
        res.send({msg: 'SUCCESS', data: results});
    } catch (error) {
        next(error);
    }
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
    let score = parseFloat(body.score);

    if (typeof requestId !== 'number' || isNaN(requestId)) {
        next('WRONG_PARAMETERS');
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

        if (typeof getToken === 'undefined' && getToken === null) {
            next(review.requestId + 'ABOUT NO TOKEN')
        }

        await reviewService.addReview(review);


        const reviewReceived = await FCM.sendNotification(getToken, "고객이 후기를 남겼습니다.", " 확인해보세요.");
        res.send('SUCCESS');
        console.log(reviewReceived + "리뷰 및 푸쉬");
    } catch (err) {
        next(err);
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
        res.send({msg: 'SUCCESS', paging: results.paging, data: results.data});
    }).catch(err => {
        next(err);
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

    if (typeof requestId !== 'number' || isNaN(requestId)) {
        next('WRONG PARAMETERS');
    }

    const request = new Request(
        requestId
    );

    reviewService.getReviewByRequestId(request).then(results => {
        res.send({msg: 'SUCCESS', data: results});
    }).catch(err => {
        next(err)
    });
}

/**
 * 메인화면 리뷰 목록 불러오기
 * @param req
 * @param res
 * @param next
 */
async function showReviewList(req, res, next) {
    const page = parseInt(req.query.page) || 1;
    const count = parseInt(req.query.count) || 30;
    const keyword = req.query.keyword;

    try {
        const results = await reviewService.getReviews(page, count, keyword);
        res.send({msg: 'SUCCESS', paging: results.paging, data: results.data});
    } catch (error) {
        next(error);
    }
}

module.exports = router;