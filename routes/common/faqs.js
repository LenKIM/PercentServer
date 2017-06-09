var express = require('express');
var router = express.Router();
var faqService = require('../../service/faq');

router.route('/faqs')
    .get(showFAQList);

async function showFAQList(req, res, next) {
    try {
        const results = await faqService.getFAQs();
        res.send({msg:'SUCCESS', data: results});
    } catch(error) {
        next(error);
    }
}

module.exports = router;
