var express = require('express');
var router = express.Router();
var Pager = require('../../model/pager');
var Notice = require('../../model/notice');
var noticeService = require('../../service/notice');

router.route('/notices')
    .get(showNoticeList)
    .post(addNotice);

router.route('/notices/:noticeId')
    .get(showNoticeDetail)
    .delete(deleteNotice)
    .put(editNotice);

function showNoticeList(req, res, next) {
    let page = parseInt(req.query.page) || 1;
    let count = parseInt(req.query.count) || 30;
    let keyword = req.query.keyword;
    let pager = new Pager(page, count, keyword);

    noticeService.getNotices(pager).then(results => {
        res.send({msg: 'success', paging : results.paging, data: results.data});
    }).catch(error => {
        next(error);
    });
}

function addNotice(req, res, next) {
    let body = req.body;
    let notice = new Notice(
        null,
        body.title,
        body.content,
        body.type
    );

    noticeService.addNotice(notice).then(results => {
        res.send({msg: 'success', status: results});
    }).catch(error => {
        next("Fail to add Notice :" + error);
    });
}

function showNoticeDetail(req, res, next) {
    let noticeId = req.params.noticeId;
    let notice = new Notice(noticeId);

    noticeService.getNotice(notice).then(results => {
        res.send({msg: 'success', data: results});
    }).catch(error => {
        next("Fail to get Notice : " + error);
    });
}

function editNotice(req, res, next) {
    let body = req.body;
    let notice = new Notice(
        req.params.noticeId,
        body.title,
        body.content,
        body.type
    );

    noticeService.updateNotice(notice).then(results => {
        res.send({msg: 'success', status: results});
    }).catch(error => {
        next("Fail to update Notice detailed : " + error);
    });
}

function deleteNotice(req, res, next) {
    var noticeId = req.params.noticeId;
    var notice = new Notice(noticeId);

    noticeService.deleteNotice(notice).then(results => {
        res.send({msg: 'success', status: results});
    }).catch(error => {
        next("Fail to delete Notice detailed : " + error);
    });
}

module.exports = router;
