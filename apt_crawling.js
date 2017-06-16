// var request = require("request");
const cheerio = require('cheerio');
const request = require('request-promise');
const cheerioTableparser = require('cheerio-tableparser');
const pool = require('./config/mysql');
const schedule = require('node-schedule');


"use strict";


function getMiddle(big) {
    return new Promise((resolve, reject) => {

        const options = {
            method: 'POST',
            url: 'http://nland.kbstar.com/quics',
            qs: {page: 'B025914', cc: 'b043428:b043506'},
            headers: {
                'cache-control': 'no-cache',
                'content-type': 'application/x-www-form-urlencoded'
            },
            form: {
                '대지역명': big
            }
        };

        var region_2 = [];

        request(options).then((bd) => {
            const $ = cheerio.load(bd);

            const parents = $('.selectbox');
            const area2 = parents['1'];


            //ex)강동구 강복구
            var b = $('#area2').find('option').length;
            var b1 = $('#area2').find('option');
            //대지역 : region_1[0]
            for (let i2 = 1; i2 < b; i2++) {
                region_2.push([b1[i2].children[0].data, big]);
            }
            resolve(region_2);
        })
    });
}

function getSmall(r, r1) {

    return new Promise((resolve, reject) => {

        const options = {
            method: 'POST',
            url: 'http://nland.kbstar.com/quics',
            qs: {page: 'B025914', cc: 'b043428:b043506'},
            headers: {
                'cache-control': 'no-cache',
                'content-type': 'application/x-www-form-urlencoded'
            },
            form: {
                '대지역명': r1,
                '중지역명': r
            }
        };

        var region_3 = [];

        request(options).then((bd) => {
            const $ = cheerio.load(bd);

            const parents = $('.selectbox');
            const area3 = parents['2'];

            //ex)강동구 강복구
            var c = $('#area3').find('option').length;
            var c1 = $('#area3').find('option');
            for (let i2 = 1; i2 < c; i2++) {
                region_3.push([c1[i2].children[0].data, r1, r]);
            }
            resolve(region_3);
        })
    })
}

function getApt(r3, r1, r2) {
    return new Promise((resolve, reject) => {
        const options = {
            method: 'POST',
            url: 'http://nland.kbstar.com/quics',
            qs: {page: 'B025914', cc: 'b043428:b043506'},
            headers: {
                'cache-control': 'no-cache',
                'content-type': 'application/x-www-form-urlencoded'
            },
            form: {
                // '대지역코드': '010000',
                '대지역명': r1,
                // '중지역코드': '010100',
                '중지역명': r2,
                // '소지역코드': '010101',
                '소지역명': r3
                // '물건식별자': '',
            }
        };

        var region_4 = [];

        request(options).then((bd) => {
            const $ = cheerio.load(bd);

            const parents = $('.selectbox');
            const area4 = parents['3'];

            //ex)강동구 강복구
            var d = $('#area4').find('option').length;
            var d1 = $('#area4').find('option');
            for (let i2 = 1; i2 < d; i2++) {
                // console.log("아파트 이름 : "+ d1[i2].children[0].data);
                // console.log("아파트 Value : "+ d1[i2].children[0].parent.attribs.value);
                region_4.push([d1[i2].children[0].data, d1[i2].children[0].parent.attribs.value]);
            }
            resolve(region_4);
        })
    })
}

function getPrice(apt_name, apt_value) {
    return new Promise((resolve, reject) => {

        const options = {
            method: 'POST',
            url: 'http://nland.kbstar.com/quics',
            qs: {page: 'B025914', cc: 'b043428:b043506'},
            headers: {
                'cache-control': 'no-cache',
                'content-type': 'application/x-www-form-urlencoded'
            },
            form: {
                '단지명': apt_name,
                '물건식별자': apt_value
            }
        };

        var priceAndSize = [];
        var price = [];
        var size1 = [];
        var size2 = [];


        request(options, function (error, response, body) {
            if (error) throw new Error(error);

            const $ = cheerio.load(body);
            cheerioTableparser($);

            var data = $(".etype").parsetable(true, true, true);

            var log = $(".grayBoxWrap");

            try {
                for (let i = 2; i <= data[0].length * 2; i = i + 2) {
                    var size = (log[0].children[1].children[i].next.children[0].children[0].data).split("/");
                    var supply = size[0];
                    var provide = size[1];
                    size1.push(supply);
                    size2.push(provide);
                }
            } catch (err) {
                // console.log("에러 개무시...");
            }
            for (let i = 2; i < data[0].length; i++) {
                price.push(data[3][i]);
            }
            const length = size1.length;
            for (let i = 0; i < length; i++) {
                var temp = [];
                temp.push(size1[i]);
                temp.push(size2[i]);
                temp.push(price[i]);
                priceAndSize.push(temp);
            }
            resolve(priceAndSize);
        });

    });
}

var rule = new schedule.RecurrenceRule();
rule.dayOfWeek = [0];
rule.hour = 1;
rule.minute = 0;

// var j = schedule.scheduleJob(rule, function () {
//
// });

async function doIt() {


    const region_1 = ["서울특별시", "경기도", "인천광역시",
        "부산광역시", "대전광역시", "대구광역시",
        "광주광역시", "울산광역시", "강원도",
        "충청남도", "충청북도", "경상남도",
        "경상북도", "전라남도", "전라북도",
        "제주특별자치도", "세종특별자치시"];

    try {
        for (let o = 0; o < region_1.length; o++) {
            console.log(region_1[o]);
            let r1 = await getMiddle(region_1[o]);
            // console.log(r1[0][0]);
            for (let i = 0; i < r1.length; i++) {
                // console.log("확인 중지역 : " + r1[i][0]);
                let r2 = await getSmall(r1[i][0], r1[i][1]);
                for (let i2 = 0; i2 < r2.length; i2++) {

                    //small = r2[0][0] big= r2[0][1]  mid = r2[0][2]
                    let r3 = await getApt(r2[i2][0], r2[i2][1], r2[i2][2]);


                    for (let i3 = 0; i3 < r3.length; i3++) {
                        //r3[i2][0] => 아파트 이름 // r3[i2][1] => 아파트 정보
                        console.log("아파트 이름 :" + r3[i3][0] + "/" + "아파트 고유 번호" + r3[i3][1]);

                        let priceAndSize = await getPrice(r3[i3][0], r3[i3][1]);
                        for (let i4 = 0; i4 < priceAndSize.length; i4++) {

                            pool.getConnection().then(conn => {
                                var sql = 'INSERT INTO apt (region_1, region_2, region_3, apt_name, apt_kb_id, apt_size_supply, apt_size_exclusive, apt_price) ' +
                                    'VALUES (?,?,?,?,?,?,?,?)';
                                conn.query(sql, [r2[0][1], r2[0][2], r2[0][0], r3[i3][0], r3[i3][1], priceAndSize[i4][0], priceAndSize[i4][1], parseInt((priceAndSize[i4][2]).replace(",", ""))]).then(results => {
                                    console.log("성공 : " + results);
                                    pool.releaseConnection(conn);
                                }).catch(err => {
                                    console.log("에러 발생 : " + err);
                                });
                            });
                        }
                        console.log(priceAndSize);
                    }
                }
            }
            request.end();
        }
    } catch (err) {
        console.log("Fail : " + err);
        throw err;
    }
}

doIt();