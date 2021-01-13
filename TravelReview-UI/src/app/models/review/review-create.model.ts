export class ReviewCreate {
    constructor(
        public reviewId: number,
        public title: string,
        public content: string,
        public photoId?: number
    ){}
}