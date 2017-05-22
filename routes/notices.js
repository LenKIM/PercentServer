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

    Notices.getNotices(page, count, keyword, function (err, results) {

        if(err) {
            return next(err);
        }

        res.send(results);
    });
}

function addNotice(req, res, next) {

    var body = req.body;
    var title = body.title;
    var content = body.content;
    var type = body.type;

    Notices.addNotice(title, content, type, function (err, results) {

        if(err) {
            return next(err);
        }

        res.send(results);
    });
}

function showNoticeDetail(req, res, next) {

    var noticeId = req.params.noticeId;

    Notices.getNotice(noticeId, function (err, results) {

        if(err) {
            return next(err);
        }

        res.send(results);
    });
}

function deleteNotice(req, res, next) {

    var noticeId = req.params.noticeId;

    Notices.deleteNotice(noticeId, function (err, results) {

        if(err) {
            return next(err);
        }

        res.send(results);
    });
}

function editNotice(req, res, next) {

    var noticeId = req.params.noticeId;
    var body = req.body;
    var title = body.title;
    var content = body.content;
    var type = body.type;

    Notices.updateNotice(noticeId, title, content, type, function (err, results) {

        if(err) {
            return next(err);
        }

        res.send(results);
    });
}

module.exports = router;
