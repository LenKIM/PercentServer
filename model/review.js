/**
 * Created by len on 2017. 5. 23..
 */

class Review {
    constructor(reviewId, requestsId, content, score, register_data){
            this.reviewId = reviewId;
            this.requestsId = requestsId;
            this.content = content;
            this.score = score;
            this.register_data = register_data;
    }
}
module.exports = Review;