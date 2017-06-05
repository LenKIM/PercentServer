const express = require('express');
const router = express.Router();
const agentService = require('../../service/agent');

router.route('/agents/:agentId')
    .get(getAgentByAgentId);

/**
 * 대출 모집인 상세 정보 불러오기
 * @param req
 * @param res
 * @param next
 */
async function getAgentByAgentId(req, res, next) {
    const agentId = req.params.agentId;

    agentService.getAgentByAgentId(agentId).then(results => {
        res.send({msg: 'success', data: results});
    }).catch(error => {
        res.send({msg: error});
    });
}

module.exports = router;