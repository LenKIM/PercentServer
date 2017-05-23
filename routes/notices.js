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

    Notices.getNotices(page, count, keyword).then(results => {
        res.send({msg: 'success', paging : results.paging, data: results.data});
    }).catch(error => {
        res.send({msg: 'failed'});
    });
}

function addNotice(req, res, next) {
    var body = req.body;
    var title = body.title;
    var content = body.content;
    var type = body.type;

    Notices.addNotice(title, content, type).then(results => {
        res.send({msg: 'success', status: results});
    }).catch(error => {
        res.send({msg: 'failed'});
    });
}

function showNoticeDetail(req, res, next) {
    var noticeId = req.params.noticeId;

    Notices.getNotice(noticeId).then(results => {
        res.send({msg: 'success', data: results});
    }).catch(error => {
        res.send({msg: 'failed'});
    });
}

function editNotice(req, res, next) {
    var noticeId = req.params.noticeId;
    var body = req.body;
    var title = body.title;
    var content = body.content;
    var type = body.type;

    Notices.updateNotice(noticeId, title, content, type).then(results => {
        res.send({msg: 'success', status: results});
    }).catch(error => {
        res.send({msg: 'failed'});
    });
}

function deleteNotice(req, res, next) {
    var noticeId = req.params.noticeId;

    Notices.deleteNotice(noticeId).then(results => {
        res.send({msg: 'success', status: results});
    }).catch(error => {
        res.send({msg: 'failed'});
    });
}

module.exports = router;
