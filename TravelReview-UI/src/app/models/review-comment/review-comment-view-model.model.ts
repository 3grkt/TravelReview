export class ReviewCommentViewModel {
    constructor(
        public parentReviewCommentId: number | null,
        public reviewCommentId: number | null,
        public reviewId: number,
        public content: string,
        public username: string,
        public publishDate: Date | null,
        public updateDate: Date | null,
        public isEditable: boolean = false,
        public deleteConfirm: boolean = false,
        public isReplying: boolean = false,
        public comments: ReviewCommentViewModel[]
    ){}
}