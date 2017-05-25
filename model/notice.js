/**
 * Notice Model
 */
class Notice {
    constructor(noticeId, title, content, type) {
        this.noticeId = noticeId;
        this.title = title;
        this.content = content;
        this.type = type;
    }
}

module.exports = Notice;

