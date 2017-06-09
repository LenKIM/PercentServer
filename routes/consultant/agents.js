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

    try {
        const results = await agentService.getAgentByAgentId(agentId);
        res.send({msg: 'SUCCESS', data: results});
    } catch (error) {

        next(error)
    }
}

module.exports = router;