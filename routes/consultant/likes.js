var express = require('express');
var router = express.Router();
var Like = require('../../model/like');
var likeService = require('../../service/like');

router.route('/likes/agents/:agentId/requests/:requestId')
    .post(LikeRequest)
    .delete(unLikeRequest);

function LikeRequest(req, res, next) {
    var body = req.body;
    var like = new Like(
        body.agentId,
        body.requestId,
        null
    );

    likeService.LikeRequest(like).then(results => {
        res.send({msg: 'success', status: results});
    }).catch(error => {
        res.send({msg: 'failed'});
    });
}

function unLikeRequest(req, res, next) {
    var like = new Like(
        req.params.agentId,
        req.params.requestId,
        null
    );

    likeService.unLikeRequest(like).then(results => {
        res.send({msg: 'success', status: results});
    }).catch(error => {
        res.send({msg: 'failed'});
    });
}

module.exports = router;
