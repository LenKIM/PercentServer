/**
 * Review Model
 */
class Review {
    constructor(reviewId, requestId, content, score, registerTime){
            this.reviewId = reviewId;
            this.requestId = requestId;
            this.content = content;
            this.score = score;
            this.registerTime = registerTime;
    }
}
module.exports = Review;