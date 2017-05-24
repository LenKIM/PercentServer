/**
 *  페이지 관련 Model
 */

class Pager {
    constructor(page, count, keyword) {
        this.page = page;
        this.count = count;
        this.keyword = keyword;
    }
}

module.exports = Pager;

