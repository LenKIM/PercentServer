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

router.route('/reviews/agents/:requestId')
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
    const requestId = parseInt(body.requestId);
    const content = body.content;
    const score = parseFloat(body.score);

    if (typeof requestId !== 'number'
        || isNaN(requestId)
        || typeof score !== 'number'
        || isNaN(score)
    ) {
        next('WRONG_PARAMETERS');
        return;
    }

    try {
        const agentToken = await agentService.getAgentTokenByRequestId(requestId);
        const addResult = await reviewService.addReview(requestId, content, score);
        const reviewReceived = await FCM.sendNotification(agentToken, "고객이 후기를 남겼습니다.", " 확인해보세요.");
        res.send({msg: 'SUCCESS'});
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