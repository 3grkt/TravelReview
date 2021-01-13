export class ReviewCommentCreate {
    constructor(
        public reviewCommentId: number,
        public reviewId: number,
        public content: string,
        public parentReviewCommentId?: number
        
    ){}
}