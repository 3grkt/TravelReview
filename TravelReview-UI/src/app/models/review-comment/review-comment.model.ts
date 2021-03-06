export class ReviewComment {
    constructor(
        public reviewCommentId: number | null,
        public reviewId: number,
        public content: string,
        public username: string,
        public applicationUserId: number,
        public publishDate: Date,
        public updateDate: Date,
        public parentReviewCommentId?: number
    ){}
}