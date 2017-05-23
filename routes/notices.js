var express = require('express');
var Notices = require('../model/notices');
var router = express.Router();

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
    var notices = new Notices();

    notices.getNotices(page, count, keyword).then(results => {
        res.send({msg: 'success', paging : results.paging, data: results.data});
    }).catch(error => {
        res.send({msg: 'failed'});
    });
}

function addNotice(req, res, next) {
    var body = req.body;
    var notices = new Notices(
        null,
        body.title,
        body.content,
        body.type
    );

    notices.addNotice().then(results => {
        res.send({msg: 'success', status: results});
    }).catch(error => {
        res.send({msg: 'failed'});
    });
}

function showNoticeDetail(req, res, next) {
    var noticeId = req.params.noticeId;
    var notices = new Notices(noticeId);

    notices.getNotice().then(results => {
        res.send({msg: 'success', data: results});
    }).catch(error => {
        res.send({msg: 'failed'});
    });
}

function editNotice(req, res, next) {
    var body = req.body;
    var notices = new Notices(
        req.params.noticeId,
        body.title,
        body.content,
        body.type
    );

    notices.updateNotice().then(results => {
        res.send({msg: 'success', status: results});
    }).catch(error => {
        res.send({msg: 'failed'});
    });
}

function deleteNotice(req, res, next) {
    var noticeId = req.params.noticeId;
    var notices = new Notices(noticeId);

    notices.deleteNotice().then(results => {
        res.send({msg: 'success', status: results});
    }).catch(error => {
        res.send({msg: 'failed'});
    });
}

module.exports = router;
