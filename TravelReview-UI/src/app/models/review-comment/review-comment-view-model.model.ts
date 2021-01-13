export class ReviewCommentViewModel {
    constructor(
        public parentReviewCommentId: number,
        public reviewCommentId: number,
        public reviewId: number,
        public content: string,
        public username: string,
        public applicationUserId: number,
        public publishDate: Date,
        public updateDate: Date,
        public isEditable: boolean = false,
        public deleteConfirm: boolean = false,
        public isReplying: boolean = false,
        public comments: ReviewCommentViewModel[]
    ){}
}