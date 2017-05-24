/**
 * Created by len on 2017. 5. 23..
 * This is for reviews and hellomoney
 */
const express = require('express');
const router = express.Router();
const Pager = require('../model/pager');
const Review = require('../model/review');
const Agent = require('../model/agent');
const reviewService = require('../service/review');


router.route('/reviews')
    .put(addReviews)
    .get(showReviewList);

router.route('/reviews/:reviewId')
    .get(showReviewByReviewId);

router.route('/reviews/agent/:agentId')
    .get(showReviewDetailByAgent);

function addReviews(req, res, next) {
    const body = req.body;

    let review = new Review(
        null,
        body.requestsId,
        body.content,
        body.score,
        null
    );

    reviewService.addReview(review).then((results) => {
        res.send({msg: 'success', status : results});
    }).catch(err => {
        res.send({mes: 'failed', error : err});
    });
}

// "SELECT customer_id FROM request AS req, review AS re WHERE req.request_id = re.request_id";
function showReviewDetailByAgent(req,res, next) {
    const agent_id = req.params.agentId;
    const agent = new Agent(agent_id);
    const page = parseInt(req.query.page);
    const count = parseInt(req.query.count);
    const pager = new Pager(page, count);
    console.log(count + " " + page);
    reviewService.getReviewByAgent(agent, pager).then(results => {
        res.send({msg: 'success', data:results});
    }).catch(err => {
        res.send({msg:'failed'});
    });
}

// "SELECT customer_id FROM request AS req, review AS re WHERE req.request_id = re.request_id";
function showReviewByReviewId(req,res, next) {
    const reviewId = req.params.reviewId;
    const review = new Review(reviewId);

    reviewService.getReviewByReviewId(review).then(results => {
        res.send({msg: 'success', data:results});
    }).catch(err => {
        res.send({msg:'failed'});
    });
}


function showReviewList(req, res, next) {
    const page = parseInt(req.query.page) || 1;
    const count = parseInt(req.query.count) || 30;
    const keyword = req.query.keyword;
    const pager = new Pager(page, count, keyword);

    reviewService.getReviews(pager).then( results => {
        res.send({msg: 'success', paging : results.paging, data:results.data});

    }).catch(err => {
        res.send({msg: 'failed'})
    });
}

module.exports= router;