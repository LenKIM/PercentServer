const express = require('express');
const router = express.Router();
const Agent = require('../../model/agent');
const Item = require('../../model/item');
const itemService = require('../../service/item');

router.route('/items')
    .get(getItemsByAgentIdAndLoanType)
    .post(addItem);

router.route('/items/:itemId')
    .get(showDetailItem)
    .put(editItem)
    .delete(deleteItem);

/**
 * 대출 상품 리스트 목록 조회
 */
async function getItemsByAgentIdAndLoanType(req, res, next) {
    const page = parseInt(req.query.page) || 1;
    const count = parseInt(req.query.count) || 30;
    const agentId = req.query.agentId;
    const loanType = req.query.loanType;

    try {
        const results = await itemService.getItems(agentId, loanType, page, count);
        res.send({msg: 'SUCCESS', paging : results.paging, data: results.data });
    } catch (error) {
        next(error);
    }
}

/**
 * 대출 모집인이 대출 상품 등록 할때 사용하는 API
 */
async function addItem(req, res, next) {
    const body = req.body;
    const agent = new Agent(
        body.agentId
    );
    const item = new Item(
        null,
        body.itemBank,
        body.itemName,
        body.minInterestRate,
        body.maxInterestRate,
        body.interestRateType,
        body.repaymentType,
        body.overdueInterestRate1,
        body.overdueInterestRate2,
        body.overdueInterestRate3,
        body.overdueTime1,
        body.overdueTime2,
        body.overdueTime3,
        body.earlyRepaymentFee,
        body.loanType
    );

    try {
        const results = await itemService.addItem(item, agent);
        res.send({msg: 'SUCCESS'});
    } catch (error) {
        next(error);
    }
}

/**
 * 특정 상품 정보 조회
 */
async function showDetailItem(req, res, next) {
    const itemId = req.params.itemId;

    try {
        const results = await itemService.getItem(itemId);
        res.send({msg: 'SUCCESS', data: results});
    } catch (error) {
        next(error);
    }
}

/**
 * 특정 상품 정보 수정
 */
async function editItem(req, res, next) {
    const body = req.body;
    const item = new Item(
        req.params.itemId,
        body.itemBank,
        body.itemName,
        body.minInterestRate,
        body.maxInterestRate,
        body.interestRateType,
        body.repaymentType,
        body.overdueInterestRate1,
        body.overdueInterestRate2,
        body.overdueInterestRate3,
        body.overdueTime1,
        body.overdueTime2,
        body.overdueTime3,
        body.earlyRepaymentFee,
        body.loanType
    );

    try {
        const results = await itemService.updateItem(item);
        res.send({msg: 'SUCCESS'});
    } catch (error) {
        next(error);
    }
}

/**
 * 특정 상품 정보 삭제
 */
async function deleteItem(req, res, next) {
    const itemId = req.params.itemId;

    try {
        const results = await itemService.deleteItem(itemId);
        res.send({msg: 'SUCCESS'});
    } catch (error) {
        next(error);
    }
}

module.exports = router;