const easyimg = require('easyimage');
const fs = require('fs');
const pathUtil = require('path');
const AWS = require('aws-sdk');
const pool = require('../config/mysql');

class uploader {

    constructor() {
        // AWS 설정
        AWS.config.region = 'ap-northeast-2';
        AWS.config.accessKeyId = 'AKIAJYB3QD7X3SVT2YAQ';
        AWS.config.secretAccessKey = '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';

        const fs = require('fs');
        if (!fs.existsSync('thumbnail')) {
            console.log('thumbnail 폴더 생성!');
        }

        this.s3 = new AWS.S3();
        this.bucketName = 'percent-s3';
        this.data = [];
    }

    // 날짜를 이용해서 임의의 파일 이름 만들기
    getItemKey(originName) {

        // 확장자 얻기
        const extname = pathUtil.extname(originName);

        const now = new Date(); // 날짜를 이용한 파일 이름 생성
        const itemKey = 'file_' + now.getYear() + now.getMonth() + now.getDay() + now.getHours() + now.getMinutes() + now.getSeconds() + Math.floor(Math.random() * 1000) + extname;
        return itemKey;
    }


    async handleImagePost(req, res) {
        // 제목(title)과 파일(image) 전송
        const title = req.body.title;
        const fileInfo = req.file;
        console.log(fileInfo);
        if (!fileInfo) {
            return res.status(400);
        }
        try {
            // 데이터베이스에 저장될 데이터
            var record = {title: title};

            const fileName = this.getItemKey(fileInfo.originalname);
            // S3에서 사용할 itemKey
            const itemKey = 'image/' + fileName;

            // S3로 이미지 업로드
            const fileUploadResult = await this.uploadToS3(itemKey, fileInfo.path, fileInfo.mimetype);
            record.url = fileUploadResult.url;

            // 썸네일 만들기
            const thumbnailPath = 'thumbnail/' + fileName;
            const thumbnail = await
                easyimg.rescrop({
                    src: fileInfo.path,
                    dst: thumbnailPath,
                    width: 100, height: 100
                });

            // 쎔네일 올리기
            const thumbnailKey = 'thumbnail/' + fileName;
            const thumbnailUploadResult = await
                this.uploadToS3(thumbnailKey, thumbnailPath, fileInfo.mimetype);

            // 썸네일 정보 데이터베이스 저장
            record.thumbnail = thumbnailUploadResult.url;

            pool.getConnection().then((conn) => {

                var sql = 'INSERT agent (agent_picture_url) VALUES (?) ';
                // INSERT INTO notice (title, content, type) VALUES (?, ?, ?)';
                conn.query(sql, [record]).then(results => {

                })
            });
            // 이미지 경로 데이터베이스 저장(배열로 대신)
            this.data.push(record);


            // TODO : 파일 삭제 오류가 발생했다고 업로드 요청을 에러로 처리할 필요는 없다. - 일괄 삭제도 고려.
            // 원본 이미지와 썸네일 이미지 삭제
            fs.unlinkSync(fileInfo.path);
            fs.unlinkSync(thumbnailPath);

            res.send({msg: 'OK', result: record});
        }
        catch (error) {
            console.log(error);
            res.status(400).send('Error');
        }
    };

    uploadToS3(itemKey, path, mimetype) {
        return new Promise((resolve, reject) => {

            const params = {
                Bucket: this.bucketName,  // 필수
                Key: itemKey,			// 필수
                ACL: 'public-read',
                Body: fs.createReadStream(path),
                ContentType: mimetype
            };

            this.s3.putObject(params, (err, data) => {
                if (err) {
                    reject(err);
                }
                else {
                    const imageUrl = this.s3.endpoint.href + this.bucketName + '/' + itemKey;
                    resolve({url: imageUrl});
                }
            });
        });
    }
}

module.exports = new uploader();