const express = require('express');
const router = express.Router();
const likeService = require('../../service/like');

router.route('/likes/agents/:agentId/requests/:requestId')
    .post(LikeRequest)
    .delete(unLikeRequest);

function LikeRequest(req, res, next) {
    const agentId = req.params.agentId;
    const requestId = parseInt(req.params.requestId);

    if (typeof requestId != 'number' || isNaN(requestId)) {
        res.send({msg: 'wrong parameters'});
        return;
    }

    likeService.LikeRequest(agentId, requestId).then(results => {
        res.send({msg: 'success'});
    }).catch(error => {
        res.send({msg: error});
    });
}

function unLikeRequest(req, res, next) {
    const agentId = req.params.agentId;
    const requestId = parseInt(req.params.requestId);

    if (typeof requestId != 'number' || isNaN(requestId)) {
        res.send({msg: 'wrong parameters'});
        return;
    }
    likeService.unLikeRequest(agentId, requestId).then(results => {
        res.send({msg: 'success'});
    }).catch(error => {
        res.send({msg: error});
    });
}

module.exports = router;
