const express = require('express');
const router = express.Router();
const likeService = require('../../service/like');

router.route('/likes/agents/:agentId/requests/:requestId')
    .post(LikeRequest)
    .delete(unLikeRequest);

async function LikeRequest(req, res, next) {
    const agentId = req.params.agentId;
    const requestId = parseInt(req.params.requestId);

    if (typeof requestId != 'number' || isNaN(requestId)) {
        res.send({msg: 'wrong parameters'});
        return;
    }

    try {
        const results = await likeService.LikeRequest(agentId, requestId);
        res.send({msg: 'success'});
    } catch (error) {
        res.send({msg: error});
    }
}

async function unLikeRequest(req, res, next) {
    const agentId = req.params.agentId;
    const requestId = parseInt(req.params.requestId);

    if (typeof requestId != 'number' || isNaN(requestId)) {
        res.send({msg: 'wrong parameters'});
        return;
    }

    try {
        const results = await likeService.unLikeRequest(agentId, requestId);
        res.send({msg: 'success'});
    } catch (error) {
        res.send({msg: error});
    }
}

module.exports = router;
