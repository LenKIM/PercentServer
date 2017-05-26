/**
 * FAQ Model
 */
class FAQ {
    constructor(faqId, question, answer, registerTime) {
        this.faqId = faqId;
        this.question = question;
        this.answer = answer;
        this.registerTime = registerTime;
    }
}

module.exports = FAQ;