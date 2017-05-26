var express = require('express');
var router = express.Router();
var faqService = require('../service/faq');

router.route('/faqs')
    .get(showFAQList);

function showFAQList(req, res, next) {
    faqService.getFAQs().then(results => {
        res.send({msg: 'success', data: results});
    }).catch(error => {
        res.send({msg: 'failed'});
    });
}

module.exports = router;
