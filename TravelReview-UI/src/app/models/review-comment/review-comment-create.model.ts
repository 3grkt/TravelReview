export class ReviewCommentCreate {
    constructor(
        public reviewCommentId: number | null,
        public reviewId: number | null,
        public content: string,
        public parentReviewCommentId?: number | null
        
    ){}
}