const express = require('express');
const router = express.Router();
const Agent = require('../model/agent');
const agentService = require('../service/agent');

router.route('/agents/:agentId')
    .get(getAgentByAgentId);

router.route('/agents/:agentId/reviews')
    .get(getReviewsByAgentId);

/**
 * 모집인 ID로 후기 목록 불러오기
 * @param req
 * @param res
 * @param next
 */
function getReviewsByAgentId(req, res, next) {
    const agentId = parseInt(req.params.agentId);
    if (typeof agentId != 'number' || isNaN(agentId)) {
        res.send({msg: 'wrong parameters'});
        return;
    }
    const agent = new Agent(agentId);

    agentService.getReviewsByAgentId(agent).then(results => {
        res.send({msg: 'success', data: results});
    }).catch(error => {
        res.send({msg: error});
    });
}

/**
 * 대출 모집인 상세 정보 불러오기
 * @param req
 * @param res
 * @param next
 */
function getAgentByAgentId(req, res, next) {
    const agentId = parseInt(req.params.agentId);
    if (typeof agentId != 'number' || isNaN(agentId)) {
        res.send({msg: 'wrong parameters'});
        return;
    }
    const agent = new Agent(agentId);

    agentService.getAgentByAgentId(agent).then(results => {
        res.send({msg: 'success', data: results});
    }).catch(error => {
        res.send({msg: error});
    });
}

module.exports = router;