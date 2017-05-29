var express = require('express');
var router = express.Router();
var Pager = require('../model/pager');
var Notice = require('../model/notice');

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

    const notice = new Notice();
    notice.getNotices(pager).then(results => {
        res.send({msg: 'success', paging : results.paging, data: results.data});
    }).catch(error => {
        res.send({msg: 'failed'});
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

    notice.addNotice().then(results => {
        res.send({msg: 'success', status: results});
    }).catch(error => {
        res.send({msg: 'failed'});
    });
}

function showNoticeDetail(req, res, next) {
    var noticeId = req.params.noticeId;
    var notice = new Notice(noticeId);

    notice.getNotice().then(results => {
        res.send({msg: 'success', data: results});
    }).catch(error => {
        res.send({msg: 'failed'});
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

    notice.updateNotice().then(results => {
        res.send({msg: 'success', status: results});
    }).catch(error => {
        res.send({msg: 'failed'});
    });
}

function deleteNotice(req, res, next) {
    var noticeId = req.params.noticeId;
    var notice = new Notice(noticeId);

    notice.deleteNotice().then(results => {
        res.send({msg: 'success', status: results});
    }).catch(error => {
        res.send({msg: 'failed'});
    });
}

module.exports = router;
