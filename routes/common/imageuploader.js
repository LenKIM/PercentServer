var express = require('express');
const multer = require('multer');
const pathUtil = require('path');
const easyimg = require('easyimage');


var router = express.Router();
var imageService = require('../../service/imageuploader');

// 멀티파트 요청 분석 미들웨어 : multer
const upload = multer({dest: 'uploads/'});

router.route('/imageUploader')
    .get(getInfoImage)
    .post(upload.single('image'), imageUploader);


function getInfoImage(req, res) {

    // 데이터베이스 대신 배열로 사용
    res.send(data)
}

async function imageUploader(req, res, next) {
    const results = await imageService.handleImagePost(req, res);
    res.send(results);
}

module.exports = router;
