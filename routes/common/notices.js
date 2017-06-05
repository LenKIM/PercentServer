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
    var page = parseInt(req.query.page) || 1;
    var count = parseInt(req.query.count) || 30;
    var keyword = req.query.keyword;
    var pager = new Pager(page, count, keyword);

    noticeService.getNotices(pager).then(results => {
        res.send({msg: 'success', paging : results.paging, data: results.data});
    }).catch(error => {
        res.send({msg: 'fail'});
    });
}

function addNotice(req, res, next) {
    var body = req.body;
    var notice = new Notice(
        null,
        body.title,
        body.content,
        body.type
    );

    noticeService.addNotice(notice).then(results => {
        res.send({msg: 'success', status: results});
    }).catch(error => {
        res.send({msg: 'fail'});
    });
}

function showNoticeDetail(req, res, next) {
    var noticeId = req.params.noticeId;
    var notice = new Notice(noticeId);

    noticeService.getNotice(notice).then(results => {
        res.send({msg: 'success', data: results});
    }).catch(error => {
        res.send({msg: 'fail'});
    });
}

function editNotice(req, res, next) {
    var body = req.body;
    var notice = new Notice(
        req.params.noticeId,
        body.title,
        body.content,
        body.type
    );

    noticeService.updateNotice(notice).then(results => {
        res.send({msg: 'success', status: results});
    }).catch(error => {
        res.send({msg: 'fail'});
    });
}

function deleteNotice(req, res, next) {
    var noticeId = req.params.noticeId;
    var notice = new Notice(noticeId);

    noticeService.deleteNotice(notice).then(results => {
        res.send({msg: 'success', status: results});
    }).catch(error => {
        res.send({msg: 'fail'});
    });
}

module.exports = router;
