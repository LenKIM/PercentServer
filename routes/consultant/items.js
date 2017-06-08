const express = require('express');
const router = express.Router();
const Agent = require('../../model/agent');
const Pager = require('../../model/pager');
const Item = require('../../model/item');
const itemService = require('../../service/item');

router.route('/:agentId/items')
    .get(showItemList)
    .put(addItem);

router.route('/items/:itemId')
    .get(showDetailItem)
    .put(editItem)
    .delete(deleteItem);
/**
 * 대출 상품 리스트 목록 조회
 */
function showItemList(req, res, next) {
    const page = parseInt(req.query.page) || 1;
    const count = parseInt(req.query.count) || 30;
    const agentId = req.params.agentId;
    const pager = new Pager(page, count);
    const agent = new Agent(agentId);

    itemService.getItems(agent, pager).then(results => {
        res.send({msg:'success', paging : results.paging, data: results.data });
    }).catch(err => {
        res.send({msg: 'failed'});
    });

}

/**
 * 대출 모집인이 대출 상품 등록 할때 사용하는 API
 */
function addItem(req, res, next) {
    //TODO ITEM 내용 확정되면 작성하기
    const body = req.body;

    const agentId = new Agent(req.params.agentId);

    const item = new Item(
        null,
        body.itemBank,
        body.itemName,
        body.minInterestrate,
        body.maxInterestrate,
        body.interestRateType,
        body.repaymentType,
        body.overdueInterestRate01,
        body.overdueInterestRate02,
        body.overdueInterestRate03,
        body.overdueTime01,
        body.overdueTime02,
        body.overdueTime03,
        body.earlyRepaymentFee
    );

    itemService.addItem(item, agentId).then(results => {
        res.send({msg: 'success', status: results})
    }).catch(err => {
        res.send({msg: 'failed', err : err});
    });
}

/**
 * 특정 상품 정보 조회
 */
function showDetailItem(req, res, next) {

    const itemId = req.params.itemId;

    itemService.getItem(itemId).then(results => {
        res.send({msg: 'success', data: results});
    }).catch(err => {
        res.send({msg: 'failed'});
    });
}

/**
 * 특정 상품 정보 수정
 */
function editItem(req, res, next) {
    const body = req.body;
    const item = new Item(
        body.itemId,
        body.itemBank,
        body.itemName,
        body.minInterestrate,
        body.maxInterestrate,
        body.interestRateType,
        body.repaymentType,
        body.overdueInterestRate01,
        body.overdueInterestRate02,
        body.overdueInterestRate03,
        body.overdueTime01,
        body.overdueTime02,
        body.overdueTime03,
        body.earlyRepaymentFee
    );

    itemService.updateItem(item).then(results => {
        res.send({msg: 'success', status: results});
    }).catch(err => {
        res.send({msg: 'failed'});
    });
}

/**
 * 특정 상품 정보 삭제
 */
function deleteItem(req, res, next) {

    const itemId = req.params.itemId;

    itemService.deleteItem(itemId).then(results => {
        res.send({msg: 'success', status: results});
    }).catch(err => {
        res.send({
             msg: 'failed',
             err: err
        });
    });
}

module.exports = router;