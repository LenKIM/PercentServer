const express = require('express');
const router = express.Router();
const noticeService = require('../../service/notice');

router.route('/notices')
    .get(showNoticeList)
    .post(addNotice);

router.route('/notices/:noticeId')
    .get(showNoticeDetail)
    .delete(deleteNotice)
    .put(editNotice);

async function showNoticeList(req, res, next) {
    const page = parseInt(req.query.page) || 1;
    const count = parseInt(req.query.count) || 30;
    const keyword = req.query.keyword;

    try {
        const results = await noticeService.getNotices(page, count, keyword);
        res.send({msg:'SUCCESS', paging : results.paging, data: results.data});
    } catch(error) {
        next(error);
    }
}

async function addNotice(req, res, next) {
    try {
        const results = await noticeService.addNotice(
            req.body.title,
            req.body.content,
            req.body.type
        );
        res.send({msg:'SUCCESS'});
    } catch(error) {
        next(error);
    }
}

async function showNoticeDetail(req, res, next) {
    const noticeId = req.params.noticeId;

    try {
        const results = await noticeService.getNotice(noticeId);
        res.send({msg:'SUCCESS', data : results});
    } catch(error) {
        next(error);
    }
}

async function editNotice(req, res, next) {
    try {
        const results = await noticeService.updateNotice(
            req.params.noticeId,
            req.body.title,
            req.body.content,
            req.body.type
        );
        res.send({msg:'SUCCESS'});
    } catch(error) {
        next(error);
    }
}

async function deleteNotice(req, res, next) {
    try {
        const results = await noticeService.deleteNotice(req.params.noticeId);
        res.send({msg:'SUCCESS'});
    } catch(error) {
        next(error);
    }
}

module.exports = router;
